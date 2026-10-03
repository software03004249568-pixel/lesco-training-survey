const SPREADSHEET_ID = '1x3KKk_9i1114W16XcpafVcmaXs9dY5ggOr8UYaddA5U';
const RESPONSE_SHEET = 'Feedback Responses';

/**
 * LESCO IT Directorate - Training Feedback Backend
 * This version writes the GitHub Pages feedback form directly to Google Sheets.
 * No Google Form and no index.html file inside Apps Script are required.
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:30px;text-align:center">' +
    '<h2>LESCO Training Feedback Backend</h2>' +
    '<p>Backend is active. Please use the GitHub Pages Feedback Form.</p>' +
    '</div>'
  );
}

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return response_('ERROR: No form data received.');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getResponseSheet_(ss);
    const p = e.parameter;

    sheet.appendRow([
      new Date(),
      clean_(p.subDivision),
      clean_(p.divisionCode),
      clean_(p.name),
      clean_(p.designation),
      clean_(p.mobile),
      clean_(p.email),
      clean_(p.trainingSession),
      clean_(p.trainer),
      clean_(p.trainingDate),
      clean_(p.contentQuality),
      clean_(p.trainerClarity),
      clean_(p.practicalUsefulness),
      clean_(p.duration),
      clean_(p.materialQuality),
      clean_(p.overallSatisfaction),
      clean_(p.topics),
      clean_(p.mostUseful),
      clean_(p.problems),
      clean_(p.suggestions),
      clean_(p.futureTraining),
      clean_(p.comments),
      clean_(p.futureParticipation)
    ]);

    SpreadsheetApp.flush();
    return response_('SUCCESS');
  } catch (err) {
    console.error(err);
    return response_('ERROR: ' + err.message);
  }
}

function setupFeedbackSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getResponseSheet_(ss);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 23);
  Logger.log('Feedback Responses sheet is ready.');
}

function getResponseSheet_(ss) {
  let sheet = ss.getSheetByName(RESPONSE_SHEET);
  if (!sheet) sheet = ss.insertSheet(RESPONSE_SHEET);

  const headers = [
    'Timestamp',
    'Sub Division',
    'Division',
    'Name',
    'Designation',
    'Mobile Number',
    'Email',
    'Training / Session Name',
    'Trainer',
    'Training Date',
    'Content Quality',
    'Trainer Explanation / Clarity',
    'Practical Usefulness',
    'Training Duration',
    'Training Material / Demonstration Quality',
    'Overall Satisfaction',
    'Useful Training Topics',
    'Most Useful Part of Training',
    'Problems / Errors',
    'Suggestions for Improvement',
    'Future Training Requirements',
    'Additional Comments',
    'Would you like to attend similar training again?'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    let different = false;
    for (let i = 0; i < headers.length; i++) {
      if (existing[i] !== headers[i]) { different = true; break; }
    }
    if (different) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  sheet.setFrozenRows(1);
  return sheet;
}

function clean_(value) {
  return value == null ? '' : String(value).trim();
}

function response_(message) {
  return ContentService
    .createTextOutput(message)
    .setMimeType(ContentService.MimeType.TEXT);
}
