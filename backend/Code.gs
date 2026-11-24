/**
 * Chytrolínci – úložiště v Google tabulce, oddělené podle rodin.
 *   list "_data"     – stav aplikace (needitovat ručně). Klíč = "KÓD|id"; řádky bez "|" patří původní rodině.
 *   list "Výsledky"  – přehled každého dokončeného dne
 *   list "_zpravy"   – nastavení týdenní zprávy e-mailem (needitovat ručně)
 *
 * TÝDENNÍ ZPRÁVY E-MAILEM: po vložení kódu jednou spusťte funkci nastavitTydenniZpravy
 * (Spustit ▶) a povolte odesílání e-mailů. Pak nasaďte novou verzi webové aplikace.
 * Každá rodina vidí jen svá data – pouze se svým rodinným kódem.
 */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.claim) return json_({ code: claim_(String(p.claim), String(p.n || '')) });
  const fam = fam_(p.f);
  if (!fam) return json_({ error: 'nofamily' });
  const data = loadAll_(fam);
  if (!data.settings && !Object.keys(data.profiles).length && fam !== legacy_()) return json_({ error: 'unknown' });
  return json_(data);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const fam = fam_(body.family);
  if (body.action === 'create') return json_(create_(fam));
  if (!fam) {
    // starší verze aplikace bez rodinného kódu → původní rodina
    if (body.action === 'save') saveItems_(legacy_(), body.items || {});
    else if (body.action === 'log') logResult_(legacy_(), body.result || {});
    return json_({ ok: true });
  }
  if (body.action === 'save') saveItems_(fam, body.items || {});
  else if (body.action === 'log') logResult_(fam, body.result || {});
  else if (body.action === 'deleteFamily' && fam !== legacy_()) deleteFamily_(fam);
  else if (body.action === 'report') return json_(report_(fam, body));
  return json_({ ok: true });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function sheet_(name) {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}
function fam_(f) { return String(f || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); }
function legacy_() {
  const pr = PropertiesService.getScriptProperties();
  let c = pr.getProperty('LEGACY_CODE');
  if (!c) { c = newCode_(); pr.setProperty('LEGACY_CODE', c); }
  return c;
}
function newCode_() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = '';
  for (let i = 0; i < 6; i++) s += A.charAt(Math.floor(Math.random() * A.length));
  return s;
}
// klíč v tabulce: původní rodina bez předpony, ostatní "KÓD|klíč"
function key_(fam, k) { return fam === legacy_() ? k : fam + '|' + k; }
function mine_(fam, rowKey) {
  rowKey = String(rowKey || ''); if (!rowKey) return null;
  if (fam === legacy_()) return rowKey.indexOf('|') < 0 ? rowKey : null;
  const pre = fam + '|';
  return rowKey.indexOf(pre) === 0 ? rowKey.slice(pre.length) : null;
}

function loadAll_(fam) {
  const values = sheet_('_data').getDataRange().getValues();
  const out = { settings: null, profiles: {} };
  values.forEach(function (r) {
    const k = mine_(fam, r[0]); if (!k) return;
    if (k === 'settings') out.settings = String(r[1]);
    else out.profiles[k] = String(r[1]);
  });
  return out;
}

// starší zařízení se přihlásí k původní rodině, pokud zná id některého jejího hrdiny
// (jen pro přechod ze starší verze; vypnete nastavením vlastnosti skriptu CLAIM_OPEN = no)
function claim_(id, name) {
  if (PropertiesService.getScriptProperties().getProperty('CLAIM_OPEN') === 'no') return '';
  if (!id || !name || id.indexOf('|') >= 0) return '';
  const vals = sheet_('_data').getDataRange().getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]) !== id) continue;
    try { if (JSON.parse(String(vals[i][1])).name === name) return legacy_(); } catch (e) {}
  }
  return '';
}

function create_(fam) {
  if (!fam || fam.length < 6 || fam === legacy_()) return { ok: false };
  const keys = sheet_('_data').getRange('A:A').getValues().map(function (r) { return String(r[0]); });
  if (keys.some(function (k) { return k.indexOf(fam + '|') === 0; })) return { ok: false, exists: true };
  return { ok: true };
}

function saveItems_(fam, items) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_('_data');
    sh.getRange('B:B').setNumberFormat('@');
    const keys = sh.getDataRange().getValues().map(function (r) { return String(r[0]); });
    Object.keys(items).forEach(function (k) {
      if (String(k).indexOf('|') >= 0) return;
      const full = key_(fam, k), i = keys.indexOf(full);
      if (i < 0) { sh.appendRow([full, items[k], new Date()]); keys.push(full); }
      else sh.getRange(i + 1, 2, 1, 2).setValues([[items[k], new Date()]]);
    });
  } finally {
    lock.releaseLock();
  }
}

function deleteFamily_(fam) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_('_data'), vals = sh.getDataRange().getValues();
    for (let i = vals.length - 1; i >= 0; i--) if (mine_(fam, vals[i][0]) !== null) sh.deleteRow(i + 1);
    const lg = sheet_('Výsledky'), lv = lg.getDataRange().getValues();
    for (let i = lv.length - 1; i >= 1; i--) if (String(lv[i][8] || '') === fam) lg.deleteRow(i + 1);
  } finally {
    lock.releaseLock();
  }
}

function logResult_(fam, r) {
  const sh = sheet_('Výsledky');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Datum', 'Dokončeno', 'Jméno', 'Ročník', 'Správně', 'Z', 'Body za den', 'Kde chyboval', 'Rodina']);
    sh.setFrozenRows(1);
    sh.getRange('1:1').setFontWeight('bold');
  }
  sh.appendRow([r.date, new Date(), r.name, r.grade + '. třída', r.c, r.n, r.pts, r.wrong, fam === legacy_() ? '' : fam]);
}

/* ---------- týdenní zpráva e-mailem ---------- */
// řádek na rodinu: Rodina | E-mail | Den (5=pá, 6=so, 7=ne) | Týden | HTML | Aktualizováno | Odesláno | Zkoušky dnes
function report_(fam, b) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  let row;
  try {
    const sh = sheet_('_zpravy');
    if (sh.getLastRow() === 0) sh.appendRow(['Rodina', 'E-mail', 'Den', 'Týden', 'HTML', 'Aktualizováno', 'Odesláno', 'Zkoušky']);
    const vals = sh.getDataRange().getValues();
    let i = -1;
    for (let r = 1; r < vals.length; r++) if (String(vals[r][0]) === fam) { i = r; break; }
    const email = String(b.email || '').trim().slice(0, 120);
    if (!email) { if (i > 0) sh.deleteRow(i + 1); return { ok: true, off: true }; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'email' };
    const html = String(b.html || '').slice(0, 45000);
    const day = [5, 6, 7].indexOf(+b.day) >= 0 ? +b.day : 6;
    const old = i > 0 ? vals[i] : null;
    row = [fam, email, day, String(b.week || ''), html, new Date(), old ? old[6] : '', old ? old[7] : ''];
    if (i > 0) sh.getRange(i + 1, 1, 1, 8).setValues([row]);
    else { sh.appendRow(row); i = sh.getLastRow() - 1; }
    if (b.now) {
      const today = Utilities.formatDate(new Date(), 'Europe/Prague', 'yyyy-MM-dd');
      const t = String(row[7] || '').split(':');
      const n = t[0] === today ? (+t[1] || 0) : 0;
      if (n >= 3) return { ok: false, error: 'limit' };
      sendReport_(email, html, true);
      sh.getRange(i + 1, 8).setValue(today + ':' + (n + 1));
      return { ok: true, sent: true };
    }
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}
// Odesílatel: chytrolinci@email.cz. Funguje, když je v Gmailu účtu, pod kterým skript běží, přidaný jako
// „Odeslat poštu jako“ (Nastavení → Účty a import). Jinak se pošle z Gmailu s odpovědí na chytrolinci@email.cz.
const ODESILATEL = 'chytrolinci@email.cz';
function sendReport_(email, html, test) {
  const subject = (test ? '[zkouška] ' : '') + 'Chytrolínci – týdenní zpráva';
  const plain = 'Týdenní zpráva ze hry Chytrolínci. Pro zobrazení otevřete e-mail v programu, který umí HTML.';
  // Odesílací server Seznamu poškozuje 4bajtové znaky (emoji) – všechno mimo ASCII pošleme jako HTML entity
  html = String(html || '').replace(/[^\x00-\x7F]/gu, function (c) { return '&#' + c.codePointAt(0) + ';'; });
  let alias = false;
  try { alias = GmailApp.getAliases().map(function (a) { return a.toLowerCase(); }).indexOf(ODESILATEL) >= 0; } catch (e) {}
  if (alias) GmailApp.sendEmail(email, subject, plain, { htmlBody: html, name: 'Chytrolínci', from: ODESILATEL, replyTo: ODESILATEL });
  else MailApp.sendEmail({ to: email, subject: subject, htmlBody: html, name: 'Chytrolínci', replyTo: ODESILATEL });
}
// kontrola z editoru: Spustit ▶ zkontrolovatOdesilatele → v Protokolu provádění je vidět, odkud se bude posílat
function zkontrolovatOdesilatele() {
  const a = GmailApp.getAliases();
  const ok = a.map(function (x) { return x.toLowerCase(); }).indexOf(ODESILATEL) >= 0;
  const msg = ok ? 'OK – zprávy půjdou z ' + ODESILATEL : 'Alias ' + ODESILATEL + ' NENÍ v Gmailu nastaven (aliasy: ' + (a.join(', ') || 'žádné') + '). Zprávy půjdou z ' + Session.getEffectiveUser().getEmail() + ' s odpovědí na ' + ODESILATEL + '.';
  Logger.log(msg); return msg;
}
// zkušební zpráva sobě (na účet, pod kterým skript běží)
function zkusebniZprava() {
  const me = Session.getEffectiveUser().getEmail();
  sendReport_(me, '<div style="font-family:Arial,sans-serif"><h2>🧠 Chytrolínci – zkušební zpráva</h2><p>Když tohle čtete a odesílatel je ' + ODESILATEL + ', je vše nastaveno. 🎉</p></div>', true);
  Logger.log('Odesláno na ' + me); return me;
}
// spouští se každou hodinu; v nastavený den od 19:00 pošle každé rodině jednu zprávu
function tydenniZpravy() {
  const now = new Date(), tz = 'Europe/Prague';
  const dow = +Utilities.formatDate(now, tz, 'u'), hour = +Utilities.formatDate(now, tz, 'H');
  const today = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
  const d = new Date(now.getTime()); d.setDate(d.getDate() - (dow - 1));
  const week = Utilities.formatDate(d, tz, 'yyyy-MM-dd');
  if (hour < 19) return;
  const sh = sheet_('_zpravy'), vals = sh.getDataRange().getValues();
  for (let r = 1; r < vals.length; r++) {
    const v = vals[r];
    if (+v[2] !== dow || !v[1]) continue;
    if (String(v[6]).slice(0, 10) === today) continue;
    if (MailApp.getRemainingDailyQuota() < 1) return;
    let html = String(v[4] || '');
    if (String(v[3]) !== week) html = '<div style="font-family:Arial,sans-serif;color:#3b2a14"><h2>🧠 Chytrolínci – týdenní zpráva</h2>' +
      '<p>Tento týden se ve hře nedokončil žádný úkol. Možná je čas na krátké procvičení? 🙂</p>' +
      '<p style="color:#7a6448;font-size:13px">Zprávy vypnete ve hře v Rodičovské sekci → Nastavení.</p></div>';
    try { sendReport_(String(v[1]), html, false); sh.getRange(r + 1, 7).setValue(today); } catch (e) {}
  }
}
// jednorázové nastavení: spustit ručně z editoru skriptu
function nastavitTydenniZpravy() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'tydenniZpravy') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('tydenniZpravy').timeBased().everyHours(1).create();
  return 'Týdenní zprávy nastaveny (kontrola každou hodinu).';
}
