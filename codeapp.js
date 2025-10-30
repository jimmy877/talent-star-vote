// Apps Script Web App handler for writing form data to Google Sheets
// Usage:
// 1) Open your Google Sheet → Extensions → Apps Script
// 2) Paste this file's content into Code.gs (or a new script file)
// 3) Set SHEET_ID to your Sheet ID (from the spreadsheet URL, NOT the deployment ID)
// 4) Deploy → New deployment → Web app → Execute as: Me, Access: Anyone
// 5) Use the Web app URL as endpoint in your site

// IMPORTANT: Sheet ID example
//   https://docs.google.com/spreadsheets/d/1AbCdEFGhIJk...XYZ/edit#gid=0
//   SHEET_ID is the long string after /d/ and before /edit

const SHEET_ID = 'PUT_YOUR_SHEET_ID_HERE'; // <-- set your spreadsheet ID here
const SHEET_NAME = 'Responses';
const SECRET = ''; // optional: set a secret and pass it as URL param t=...

// Fixed column order and Russian headers (row 1)
const RU_ORDER = [
  'collaboration', 'case', 'innovation', 'employee', 'newcomer',
  'step', 'manager', 'hero', 'supportive', 'idea', 'team'
];

const RU_TITLES = {
  collaboration: 'Коллаборация года',
  case:         'Кейс года',
  innovation:   'Инновация года',
  employee:     'Сотрудник года',
  newcomer:     'Открытие года',
  step:         'STEP года',
  manager:      'Руководитель года',
  hero:         'Тихий герой',
  supportive:   'Самый поддерживающий талант года',
  idea:         'Идея года',
  team:         'Команда года',
};

function doPost(e) {
  try {
    if (!e || !e.postData) return _res({ ok: false, error: 'No data' }, 400);
    if (SECRET && (e.parameter.t !== SECRET)) return _res({ ok: false, error: 'Unauthorized' }, 401);

    const data = parseBody_(e);

    const lang = data.language || '';
    const noms = data.nominations || {};

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Ensure header row with RU titles
    ensureHeader_(sh);

    // Build column stacks: per nomination -> array of cells, where each cell contains
    // "Name\nReason"; each additional nominee occupies a separate cell (separate row).
    const stacks = RU_ORDER.map((id) => {
      const list = (noms[id] || []);
      if (!list.length) return [];
      return list.map((item) => {
        const name = (item && item.name ? String(item.name) : '').trim();
        const why  = (item && item.story ? String(item.story) : '').trim();
        const parts = [];
        if (name) parts.push(name);
        if (why)  parts.push(why);
        return parts.join('\n');
      });
    });

    // Determine how many rows to append for this submission.
    const extraRows = Math.max(1, ...stacks.map((arr) => arr.length || 0));

    // Prepare matrix [extraRows x totalCols]
    const totalCols = 2 + RU_ORDER.length; // Timestamp, Language, then nominations
    const values = Array.from({ length: extraRows }, () => Array(totalCols).fill(''));

    for (let r = 0; r < extraRows; r++) {
      // Timestamp + Language только в первой строке блока
      if (r === 0) {
        values[r][0] = new Date();
        values[r][1] = lang;
      }

      // Заполняем по колонкам С.. далее
      RU_ORDER.forEach((id, idx) => {
        const colStack = stacks[idx] || [];
        if (colStack[r]) values[r][2 + idx] = colStack[r];
      });
    }

    // Append all rows at once
    const startRow = sh.getLastRow() + 1;
    sh.getRange(startRow, 1, values.length, values[0].length).setValues(values).setWrap(true);

    return _res({ ok: true, rows: values.length, cols: totalCols });
  } catch (err) {
    return _res({ ok: false, error: String(err) }, 500);
  }
}

function ensureHeader_(sh) {
  const header = ['Timestamp', 'Language', ...RU_ORDER.map((k) => RU_TITLES[k])];
  sh.getRange(1, 1, 1, header.length).setValues([header]);
  sh.setFrozenRows(1);
  try { sh.autoResizeColumns(1, header.length); } catch (e) {}
}

function parseBody_(e) {
  const ct = (e.postData.type || '').toLowerCase();
  let data = {};
  if (ct.includes('application/json')) {
    data = JSON.parse(e.postData.contents || '{}');
  } else {
    data = Object.fromEntries(Object.entries(e.parameter || {}));
    if (data.json) { try { data = JSON.parse(data.json); } catch (_) {} }
  }
  return data || {};
}

function _res(obj, code) {
  const out = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  if (code) out.setResponseCode(code);
  return out;
}
