/**
 * Počítací hrdinové – úložiště výsledků v Google tabulce.
 *   list "_data"     – stav aplikace (needitovat ručně)
 *   list "Výsledky"  – přehled každého dokončeného dne
 */
function doGet(e) {
  return json_(loadAll_());
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.action === 'save') saveItems_(body.items || {});
  else if (body.action === 'log') logResult_(body.result || {});
  return json_({ ok: true });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function loadAll_() {
  const values = sheet_('_data').getDataRange().getValues();
  const out = { settings: null, profiles: {} };
  values.forEach(function (r) {
    if (!r[0]) return;
    if (r[0] === 'settings') out.settings = String(r[1]);
    else out.profiles[r[0]] = String(r[1]);
  });
  return out;
}

function saveItems_(items) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_('_data');
    sh.getRange('B:B').setNumberFormat('@');
    const keys = sh.getDataRange().getValues().map(function (r) { return r[0]; });
    Object.keys(items).forEach(function (k) {
      const i = keys.indexOf(k);
      if (i < 0) { sh.appendRow([k, items[k], new Date()]); keys.push(k); }
      else sh.getRange(i + 1, 2, 1, 2).setValues([[items[k], new Date()]]);
    });
  } finally {
    lock.releaseLock();
  }
}

function logResult_(r) {
  const sh = sheet_('Výsledky');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Datum', 'Dokončeno', 'Jméno', 'Ročník', 'Správně', 'Z', 'Body za den', 'Kde chyboval']);
    sh.setFrozenRows(1);
    sh.getRange('1:1').setFontWeight('bold');
  }
  sh.appendRow([r.date, new Date(), r.name, r.grade + '. třída', r.c, r.n, r.pts, r.wrong]);
}
