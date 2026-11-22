/**
 * Chytrolínci – úložiště v Google tabulce, oddělené podle rodin.
 *   list "_data"     – stav aplikace (needitovat ručně). Klíč = "KÓD|id"; řádky bez "|" patří původní rodině.
 *   list "Výsledky"  – přehled každého dokončeného dne
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
