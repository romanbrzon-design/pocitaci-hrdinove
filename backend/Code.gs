/**
 * Chytrolínci – úložiště v Google tabulce, oddělené podle rodin.
 *   list "_data"     – stav aplikace (needitovat ručně). Klíč = "KÓD|id"; řádky bez "|" patří původní rodině.
 *   list "Výsledky"  – přehled každého dokončeného dne
 *   list "_zpravy"   – nastavení týdenní zprávy e-mailem (needitovat ručně)
 *   list "Přání"     – kniha přání od rodičů (každé přání se zároveň pošle e-mailem na chytrolinci@email.cz)
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
  if (body.action === 'save') return json_({ ok: true, rejected: saveItems_(fam, body.items || {}) });
  else if (body.action === 'log') logResult_(fam, body.result || {});
  else if (body.action === 'backups') return json_({ ok: true, list: backups_(fam, String(body.id || '')) });
  else if (body.action === 'restore') return json_(restore_(fam, String(body.id || ''), +body.row || 0));
  else if (body.action === 'deleteFamily' && fam !== legacy_()) deleteFamily_(fam);
  else if (body.action === 'report') return json_(report_(fam, body));
  else if (body.action === 'wish') return json_(wish_(fam, body));
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

// Ukládání s pojistkou (24. 11. 2026): starší kopie hrdiny (méně XP / méně správných odpovědí)
// NEPŘEPÍŠE uloženého hrdinu – zůstane serverová verze, zamítnutá kopie jde do listu _zaloha.
// Výjimka: vědomý reset rodičem (vyšší číslo výpravy „season“ nebo smazání hrdiny).
// Před každým přepsáním se (nejvýše jednou za hodinu na hrdinu) uloží záloha předchozího stavu.
function progress_(j) {
  try { const p = JSON.parse(j); return { xp: +p.xp || 0, tc: +p.totalCorrect || 0, ts: +p.ts || 0, season: +p.season || 1, del: !!p.deleted, name: p.name || '' }; }
  catch (e) { return null; }
}
function backup_(full, json, why) {
  const sh = sheet_('_zaloha');
  if (sh.getLastRow() === 0) { sh.appendRow(['Kdy', 'Klíč', 'Důvod', 'Data']); sh.setFrozenRows(1); sh.getRange('D:D').setNumberFormat('@'); }
  sh.appendRow([new Date(), full, why, json]);
}
function saveItems_(fam, items) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  const rejected = [];
  try {
    const sh = sheet_('_data');
    sh.getRange('B:B').setNumberFormat('@');
    const vals = sh.getDataRange().getValues();
    const keys = vals.map(function (r) { return String(r[0]); });
    const cache = CacheService.getScriptCache();
    Object.keys(items).forEach(function (k) {
      if (String(k).indexOf('|') >= 0) return;
      const full = key_(fam, k), i = keys.indexOf(full);
      if (i < 0) { sh.appendRow([full, items[k], new Date()]); keys.push(full); return; }
      const old = String(vals[i][1] || '');
      if (old === items[k]) return;
      if (k !== 'settings') {
        const o = progress_(old), n = progress_(items[k]);
        if (o && n && !n.del && n.season <= o.season && (n.xp < o.xp || n.tc < o.tc || (n.xp === o.xp && n.tc === o.tc && o.ts && n.ts < o.ts))) {
          backup_(full, items[k], 'zamítnuto: starší kopie (' + n.name + ' xp ' + n.xp + ' < ' + o.name + ' xp ' + o.xp + ')');
          rejected.push(k); return;
        }
        if (!cache.get('bk|' + full)) { backup_(full, old, 'průběžná záloha'); cache.put('bk|' + full, '1', 3600); }
      }
      sh.getRange(i + 1, 2, 1, 2).setValues([[items[k], new Date()]]);
    });
  } finally {
    lock.releaseLock();
  }
  return rejected;
}
// seznam záloh hrdiny pro rodičovskou sekci (bez samotných dat – jen přehled)
function backups_(fam, id) {
  const sh = SpreadsheetApp.getActive().getSheetByName('_zaloha'); if (!sh) return [];
  const full = key_(fam, id), out = [];
  sh.getDataRange().getValues().forEach(function (r, i) {
    if (i === 0 || String(r[1]) !== full) return;
    const p = progress_(String(r[3])); if (!p) return;
    out.push({ row: i + 1, when: Utilities.formatDate(new Date(r[0]), 'Europe/Prague', 'd. M. yyyy H:mm'), why: String(r[2]), name: p.name, xp: p.xp, tc: p.tc });
  });
  return out.slice(-30).reverse();
}
// obnovení hrdiny ze zálohy (řádek listu _zaloha musí patřit stejné rodině a hrdinovi)
function restore_(fam, id, row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const bk = SpreadsheetApp.getActive().getSheetByName('_zaloha'); if (!bk) return { ok: false };
    const r = bk.getRange(row, 1, 1, 4).getValues()[0], full = key_(fam, id);
    if (String(r[1]) !== full) return { ok: false };
    const sh = sheet_('_data'), keys = sh.getDataRange().getValues().map(function (x) { return String(x[0]); });
    const i = keys.indexOf(full);
    const p = JSON.parse(String(r[3])); p.ts = Date.now();
    const json = JSON.stringify(p);
    if (i >= 0) { backup_(full, String(sh.getRange(i + 1, 2).getValue()), 'před obnovením'); sh.getRange(i + 1, 2, 1, 2).setValues([[json, new Date()]]); }
    else sh.appendRow([full, json, new Date()]);
    return { ok: true, profile: json };
  } finally { lock.releaseLock(); }
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

/* ---------- kniha přání od rodičů ---------- */
// list "Přání": Kdy | Rodina | Druh | Text | E-mail rodiče | Info o zařízení | Odesláno e-mailem
const PRANI_DRUHY = { idea: 'Nápad na vylepšení', learn: 'Chybí mi učivo', bug: 'Chyba v otázce nebo ve hře', praise: 'Pochvala', other: 'Jiné' };
function wish_(fam, b) {
  const text = String(b.text || '').trim().slice(0, 3000);
  if (text.length < 3) return { ok: false, error: 'empty' };
  let email = String(b.email || '').trim().slice(0, 120);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) email = '';
  const kind = PRANI_DRUHY[b.kind] ? b.kind : 'other';
  const info = String(b.info || '').slice(0, 500);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  let row;
  try {
    const sh = sheet_('Přání');
    if (sh.getLastRow() === 0) { sh.appendRow(['Kdy', 'Rodina', 'Druh', 'Text', 'E-mail rodiče', 'Info', 'Odesláno e-mailem']); sh.setFrozenRows(1); }
    // ochrana proti zahlcení: nejvýš 10 přání od jedné rodiny za den
    const today = Utilities.formatDate(new Date(), 'Europe/Prague', 'yyyy-MM-dd');
    const vals = sh.getDataRange().getValues();
    let n = 0;
    for (let r = Math.max(1, vals.length - 300); r < vals.length; r++)
      if (String(vals[r][1]) === fam && vals[r][0] instanceof Date && Utilities.formatDate(vals[r][0], 'Europe/Prague', 'yyyy-MM-dd') === today) n++;
    if (n >= 10) return { ok: false, error: 'limit' };
    sh.appendRow([new Date(), fam, PRANI_DRUHY[kind], text, email, info, '']);
    row = sh.getLastRow();
  } finally {
    lock.releaseLock();
  }
  let sent = false;
  try { sendWish_(fam, PRANI_DRUHY[kind], text, email, info); sent = true; sheet_('Přání').getRange(row, 7).setValue('ano'); } catch (e) { sheet_('Přání').getRange(row, 7).setValue('chyba: ' + e); }
  return { ok: true, wish: true, sent: sent };
}
function esc_(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function sendWish_(fam, druh, text, email, info) {
  const subject = 'Chytrolínci – kniha přání: ' + druh;
  let html = '<div style="font-family:Arial,sans-serif;font-size:15px">' +
    '<h2 style="margin:0 0 10px">💡 Nové přání do hry Chytrolínci</h2>' +
    '<p><b>Druh:</b> ' + esc_(druh) + '<br><b>Rodina:</b> ' + esc_(fam) + '<br><b>Kdy:</b> ' + Utilities.formatDate(new Date(), 'Europe/Prague', 'd. M. yyyy H:mm') +
    '<br><b>E-mail rodiče:</b> ' + (email ? esc_(email) + ' (stačí odpovědět na tento e-mail)' : 'neuveden') + '</p>' +
    '<div style="background:#fff7e0;border:1px solid #e8d49a;border-radius:10px;padding:12px;white-space:pre-wrap">' + esc_(text) + '</div>' +
    '<p style="color:#888;font-size:12px;margin-top:12px">' + esc_(info) + '<br>Všechna přání jsou i v Google tabulce na listu „Přání“.</p></div>';
  const plain = druh + '\nRodina: ' + fam + '\nE-mail: ' + (email || 'neuveden') + '\n\n' + text + '\n\n' + info;
  html = html.replace(/[^\x00-\x7F]/gu, function (c) { return '&#' + c.codePointAt(0) + ';'; });
  const opt = { htmlBody: html, name: 'Chytrolínci – kniha přání' };
  if (email) opt.replyTo = email;
  let alias = false;
  try { alias = GmailApp.getAliases().map(function (a) { return a.toLowerCase(); }).indexOf(ODESILATEL) >= 0; } catch (e) {}
  if (alias) { opt.from = ODESILATEL; GmailApp.sendEmail(ODESILATEL, subject, plain, opt); }
  else { opt.to = ODESILATEL; opt.subject = subject; MailApp.sendEmail(opt); }
}
// zkouška z editoru: Spustit ▶ zkusebniPrani → na chytrolinci@email.cz přijde zkušební přání
function zkusebniPrani() { return wish_('TEST', { kind: 'idea', text: 'Zkušební přání z editoru skriptu.', email: '', info: 'test' }); }
