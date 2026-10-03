const SPREADSHEET_ID = '1x3KKk_9i1114W16XcpafVcmaXs9dY5ggOr8UYaddA5U';

// The existing Training Survey form ID from the previous HTML.
// Leave blank ('') if you want the script to create a new Feedback form.
const EXISTING_FORM_ID = ''; // Optional: put the actual Google Form EDIT ID here. Leave blank to reuse FormConfig when available.

const RESPONSE_SHEET = 'Feedback Responses';
const CONFIG_SHEET = 'FormConfig';

function createLescoFeedbackForm() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const form = getOrCreateFeedbackForm_();

  // Remove old trigger(s) for this handler so repeated runs do not create duplicates.
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'copyLescoFeedbackResponse') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  form.setTitle('LESCO IT Directorate – Training Feedback Form');
  form.setDescription(
    'Feedback form for LESCO IT Directorate training sessions. ' +
    'Your feedback will be used to improve training quality, practical usefulness and future training programs.'
  );
  form.setConfirmationMessage('آپ کا Feedback کامیابی سے جمع ہو گیا ہے۔ شکریہ۔');
  form.setCollectEmail(false);
  form.setAcceptingResponses(true);

  // Rebuild the form so the old Training Survey questions are replaced by Feedback questions.
  const oldItems = form.getItems();
  oldItems.forEach(function(item) {
    form.deleteItem(item);
  });

  const items = {};

  // Participant information
  items.subDivision = form.addTextItem()
    .setTitle('Sub Division')
    .setRequired(true);

  items.divisionCode = form.addTextItem()
    .setTitle('Division')
    .setRequired(false);

  items.name = form.addTextItem()
    .setTitle('Name')
    .setRequired(true);

  items.designation = form.addMultipleChoiceItem()
    .setTitle('Designation')
    .setChoiceValues(['Auditor', 'Supervisor', 'Other'])
    .setRequired(true);

  items.mobile = form.addTextItem()
    .setTitle('Mobile Number')
    .setRequired(true);

  items.email = form.addTextItem()
    .setTitle('Email')
    .setRequired(false);

  items.trainingSession = form.addTextItem()
    .setTitle('Training / Session Name')
    .setRequired(true);

  items.trainer = form.addMultipleChoiceItem()
    .setTitle('Trainer')
    .setChoiceValues(['Ali Waqas Tiwana', 'Imran Ahmad', 'Both Trainers', 'Other'])
    .setRequired(false);

  items.trainingDate = form.addDateItem()
    .setTitle('Training Date')
    .setRequired(false);

  // Ratings
  items.contentQuality = form.addMultipleChoiceItem()
    .setTitle('Content Quality')
    .setChoiceValues(['1 - Low', '2 - Satisfactory', '3 - Good', '4 - Very Good', '5 - Excellent'])
    .setRequired(true);

  items.trainerClarity = form.addMultipleChoiceItem()
    .setTitle('Trainer Explanation / Clarity')
    .setChoiceValues(['1 - Low', '2 - Satisfactory', '3 - Good', '4 - Very Good', '5 - Excellent'])
    .setRequired(true);

  items.practicalUsefulness = form.addMultipleChoiceItem()
    .setTitle('Practical Usefulness')
    .setChoiceValues(['1 - Not Useful', '2 - Low', '3 - Adequate', '4 - Highly Useful', '5 - Very Highly Useful'])
    .setRequired(true);

  items.duration = form.addMultipleChoiceItem()
    .setTitle('Training Duration')
    .setChoiceValues(['Too Short', 'Appropriate', 'Too Long'])
    .setRequired(true);

  items.materialQuality = form.addMultipleChoiceItem()
    .setTitle('Training Material / Demonstration Quality')
    .setChoiceValues(['1 - Low', '2 - Satisfactory', '3 - Good', '4 - Very Good', '5 - Excellent'])
    .setRequired(true);

  items.overallSatisfaction = form.addMultipleChoiceItem()
    .setTitle('Overall Satisfaction')
    .setChoiceValues(['1 - Dissatisfied', '2 - Less Satisfied', '3 - Satisfied', '4 - Very Satisfied', '5 - Completely Satisfied'])
    .setRequired(true);

  items.topics = form.addCheckboxItem()
    .setTitle('Useful Training Topics')
    .setChoiceValues([
      'Mobile Meter Reading',
      'Level-1 Software',
      'Pre-Enter Import',
      'Parts Generation',
      'Field Meter Reading',
      'Reading Export / Posting',
      'Snaps Import & Verification',
      'Auditing',
      'GBMR / IBMR',
      'Supervisor Import / Dump',
      'CP21C / CP34C',
      'Units Calculation',
      'Level-1 Installation',
      'Database Backup / Restore',
      'Tailscale',
      'Secure Manager',
      'FTP Client 1.11'
    ])
    .setRequired(false);

  // Written feedback
  items.mostUseful = form.addParagraphTextItem()
    .setTitle('Most Useful Part of Training')
    .setRequired(false);

  items.problems = form.addParagraphTextItem()
    .setTitle('Problems / Errors')
    .setRequired(false);

  items.suggestions = form.addParagraphTextItem()
    .setTitle('Suggestions for Improvement')
    .setRequired(false);

  items.futureTraining = form.addParagraphTextItem()
    .setTitle('Future Training Requirements')
    .setRequired(false);

  items.comments = form.addParagraphTextItem()
    .setTitle('Additional Comments')
    .setRequired(false);

  items.futureParticipation = form.addMultipleChoiceItem()
    .setTitle('Would you like to attend similar training again?')
    .setChoiceValues(['Yes', 'No'])
    .setRequired(true);

  // Keep the form linked to the same spreadsheet file, while using a separate sheet
  // for feedback so the previous survey responses are not overwritten.
  let responseSheet = ss.getSheetByName(RESPONSE_SHEET);
  if (!responseSheet) {
    responseSheet = ss.insertSheet(RESPONSE_SHEET);
  }

  const headers = [
    'Timestamp', 'Sub Division', 'Division', 'Name', 'Designation', 'Mobile Number',
    'Email', 'Training / Session Name', 'Trainer', 'Training Date', 'Content Quality',
    'Trainer Explanation / Clarity', 'Practical Usefulness', 'Training Duration',
    'Training Material / Demonstration Quality', 'Overall Satisfaction',
    'Useful Training Topics', 'Most Useful Part of Training', 'Problems / Errors',
    'Suggestions for Improvement', 'Future Training Requirements', 'Additional Comments',
    'Would you like to attend similar training again?'
  ];

  if (responseSheet.getLastRow() === 0) {
    responseSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    responseSheet.setFrozenRows(1);
  }

  // Create a fresh installable form-submit trigger.
  ScriptApp.newTrigger('copyLescoFeedbackResponse')
    .forForm(form)
    .onFormSubmit()
    .create();

  const postUrl = form.getPublishedUrl().replace(/\/viewform(?:\?.*)?$/, '/formResponse');

  let config = ss.getSheetByName(CONFIG_SHEET);
  if (!config) config = ss.insertSheet(CONFIG_SHEET);
  config.clear();

  const configRows = [
    ['KEY', 'VALUE'],
    ['FORM_EDIT_URL', form.getEditUrl()],
    ['FORM_PUBLISHED_URL', form.getPublishedUrl()],
    ['FORM_POST_URL', postUrl],
    ['subDivision', 'entry.' + items.subDivision.getId()],
    ['divisionCode', 'entry.' + items.divisionCode.getId()],
    ['name', 'entry.' + items.name.getId()],
    ['designation', 'entry.' + items.designation.getId()],
    ['mobile', 'entry.' + items.mobile.getId()],
    ['email', 'entry.' + items.email.getId()],
    ['trainingSession', 'entry.' + items.trainingSession.getId()],
    ['trainer', 'entry.' + items.trainer.getId()],
    ['trainingDate', 'entry.' + items.trainingDate.getId()],
    ['contentQuality', 'entry.' + items.contentQuality.getId()],
    ['trainerClarity', 'entry.' + items.trainerClarity.getId()],
    ['practicalUsefulness', 'entry.' + items.practicalUsefulness.getId()],
    ['duration', 'entry.' + items.duration.getId()],
    ['materialQuality', 'entry.' + items.materialQuality.getId()],
    ['overallSatisfaction', 'entry.' + items.overallSatisfaction.getId()],
    ['topics', 'entry.' + items.topics.getId()],
    ['mostUseful', 'entry.' + items.mostUseful.getId()],
    ['problems', 'entry.' + items.problems.getId()],
    ['suggestions', 'entry.' + items.suggestions.getId()],
    ['futureTraining', 'entry.' + items.futureTraining.getId()],
    ['comments', 'entry.' + items.comments.getId()],
    ['futureParticipation', 'entry.' + items.futureParticipation.getId()]
  ];

  config.getRange(1, 1, configRows.length, 2).setValues(configRows);
  config.autoResizeColumns(1, 2);

  Logger.log('=====================================================');
  Logger.log('LESCO FEEDBACK FORM CREATED / UPDATED');
  Logger.log('FORM_POST_URL=' + postUrl);
  configRows.slice(4).forEach(function(row) {
    Logger.log(row[0] + '=' + row[1]);
  });
  Logger.log('EDIT_URL=' + form.getEditUrl());
  Logger.log('PUBLISHED_URL=' + form.getPublishedUrl());
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('LESCO IT Directorate – Training Feedback')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getOrCreateFeedbackForm_() {
  // 1) If an actual Google Form EDIT ID is supplied, use it.
  if (EXISTING_FORM_ID) {
    try {
      return FormApp.openById(EXISTING_FORM_ID);
    } catch (err) {
      Logger.log('EXISTING_FORM_ID could not be opened: ' + err);
    }
  }

  // 2) Otherwise reuse the Form ID saved in FormConfig from an earlier run.
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const config = ss.getSheetByName(CONFIG_SHEET);
    if (config) {
      const values = config.getDataRange().getValues();
      for (let i = 0; i < values.length; i++) {
        if (String(values[i][0]).trim() === 'FORM_EDIT_URL') {
          const url = String(values[i][1] || '');
          const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
          if (match) {
            try {
              return FormApp.openById(match[1]);
            } catch (err2) {
              Logger.log('Saved FORM_EDIT_URL could not be opened: ' + err2);
            }
          }
        }
      }
    }
  } catch (err3) {
    Logger.log('Could not read FormConfig: ' + err3);
  }

  // 3) No previous form found: create one.
  return FormApp.create('LESCO IT Directorate – Training Feedback Form');
}

function copyLescoFeedbackResponse(e) {
  if (!e || !e.response) throw new Error('No form response event');

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESPONSE_SHEET);
  if (!sheet) throw new Error('Feedback Responses sheet not found');

  const map = {};
  e.response.getItemResponses().forEach(function(ir) {
    const title = ir.getItem().getTitle();
    let value = ir.getResponse();
    if (Array.isArray(value)) value = value.join(', ');
    map[title] = value == null ? '' : String(value);
  });

  sheet.appendRow([
    e.response.getTimestamp(),
    map['Sub Division'] || '',
    map['Division'] || '',
    map['Name'] || '',
    map['Designation'] || '',
    map['Mobile Number'] || '',
    map['Email'] || '',
    map['Training / Session Name'] || '',
    map['Trainer'] || '',
    map['Training Date'] || '',
    map['Content Quality'] || '',
    map['Trainer Explanation / Clarity'] || '',
    map['Practical Usefulness'] || '',
    map['Training Duration'] || '',
    map['Training Material / Demonstration Quality'] || '',
    map['Overall Satisfaction'] || '',
    map['Useful Training Topics'] || '',
    map['Most Useful Part of Training'] || '',
    map['Problems / Errors'] || '',
    map['Suggestions for Improvement'] || '',
    map['Future Training Requirements'] || '',
    map['Additional Comments'] || '',
    map['Would you like to attend similar training again?'] || ''
  ]);

  SpreadsheetApp.flush();
}
