/*******************************************************
 * LESCO IT DIRECTORATE
 * TRAINING FEEDBACK - GOOGLE FORM BACKEND
 *
 * Google Form
 *      ↓
 * Google Spreadsheet
 *      ↓
 * Custom GitHub Pages Form
 *
 * Spreadsheet ID:
 * 1x3KKk_9i1114W16XcpafVcmaXs9dY5ggOr8UYaddA5U
 *******************************************************/


/* =====================================================
   BASIC CONFIGURATION
   ===================================================== */

const SPREADSHEET_ID =
  '1x3KKk_9i1114W16XcpafVcmaXs9dY5ggOr8UYaddA5U';

const FORM_TITLE =
  'LESCO IT Directorate - Training Feedback';

const FORM_DESCRIPTION =
  'LESCO IT Directorate Training Feedback Form';


/* =====================================================
   1. CREATE GOOGLE FORM
   ===================================================== */

function createLescoFeedbackForm() {

  const props = PropertiesService.getScriptProperties();

  // اگر Form پہلے ہی بن چکا ہے تو دوبارہ نہ بنائیں
  let existingFormId = props.getProperty('LESC0_FORM_ID');

  if (existingFormId) {

    try {

      const existingForm =
        FormApp.openById(existingFormId);

      Logger.log(
        'Google Form already exists.'
      );

      Logger.log(
        'Form ID: ' + existingForm.getId()
      );

      Logger.log(
        'Form URL: ' + existingForm.getPublishedUrl()
      );

      Logger.log(
        'Edit URL: ' + existingForm.getEditUrl()
      );

      return;

    } catch (err) {

      // اگر saved ID invalid ہو تو نیا Form بنائیں
      props.deleteProperty('LESC0_FORM_ID');
    }
  }


  /* ---------------------------------------------------
     CREATE FORM
     --------------------------------------------------- */

  const form =
    FormApp.create(FORM_TITLE);


  form.setDescription(
    FORM_DESCRIPTION
  );


  form.setConfirmationMessage(
    'آپ کا Feedback کامیابی سے جمع ہو گیا ہے۔ شکریہ۔'
  );


  form.setCollectEmail(false);


  /* ===================================================
     PARTICIPANT INFORMATION
     =================================================== */

  form.addTextItem()
    .setTitle('Sub-Division')
    .setRequired(true);


  form.addTextItem()
    .setTitle('Division')
    .setRequired(false);


  form.addTextItem()
    .setTitle('Name')
    .setRequired(true);


  form.addListItem()
    .setTitle('Designation')
    .setChoiceValues([
      'Auditor',
      'Supervisor',
      'Other'
    ])
    .setRequired(true);


  form.addTextItem()
    .setTitle('Mobile Number')
    .setRequired(false);


  form.addTextItem()
    .setTitle('Email')
    .setRequired(false);


  /* ===================================================
     TRAINING INFORMATION
     =================================================== */

  form.addTextItem()
    .setTitle('Training / Session Name')
    .setRequired(true);


  form.addListItem()
    .setTitle('Trainer')
    .setChoiceValues([
      'Ali Waqas Tiwana',
      'Imran Ahmad',
      'Both Trainers',
      'Other'
    ])
    .setRequired(true);


  form.addDateItem()
    .setTitle('Training Date')
    .setRequired(true);


  /* ===================================================
     TRAINING EVALUATION
     =================================================== */

  form.addListItem()
    .setTitle('Content Quality')
    .setChoiceValues([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    .setRequired(true);


  form.addListItem()
    .setTitle('Trainer Explanation / Clarity')
    .setChoiceValues([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    .setRequired(true);


  form.addListItem()
    .setTitle('Practical Usefulness')
    .setChoiceValues([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    .setRequired(true);


  form.addListItem()
    .setTitle('Training Duration')
    .setChoiceValues([
      'Too Short',
      'Appropriate',
      'Too Long'
    ])
    .setRequired(true);


  form.addListItem()
    .setTitle('Training Material / Demonstration Quality')
    .setChoiceValues([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    .setRequired(true);


  form.addListItem()
    .setTitle('Overall Satisfaction')
    .setChoiceValues([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    .setRequired(true);


  /* ===================================================
     USEFUL TRAINING TOPICS
     =================================================== */

  form.addCheckboxItem()
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


  /* ===================================================
     OPEN FEEDBACK
     =================================================== */

  form.addParagraphTextItem()
    .setTitle('Most Useful Part of Training')
    .setRequired(false);


  form.addParagraphTextItem()
    .setTitle('Problems / Errors')
    .setRequired(false);


  form.addParagraphTextItem()
    .setTitle('Suggestions for Improvement')
    .setRequired(false);


  form.addParagraphTextItem()
    .setTitle('Future Training Requirements')
    .setRequired(false);


  form.addParagraphTextItem()
    .setTitle('Additional Comments')
    .setRequired(false);


  /* ===================================================
     FUTURE PARTICIPATION
     =================================================== */

  form.addMultipleChoiceItem()
    .setTitle(
      'Would you like to attend similar training again?'
    )
    .setChoiceValues([
      'Yes',
      'No'
    ])
    .setRequired(false);


  /* ===================================================
     LINK GOOGLE FORM WITH EXISTING SPREADSHEET
     =================================================== */

  form.setDestination(
    FormApp.DestinationType.SPREADSHEET,
    SPREADSHEET_ID
  );


  /* ===================================================
     SAVE FORM ID
     =================================================== */

  props.setProperty(
    'LESC0_FORM_ID',
    form.getId()
  );


  /* ===================================================
     LOG FORM INFORMATION
     =================================================== */

  Logger.log(
    '=========================================='
  );

  Logger.log(
    'GOOGLE FORM CREATED SUCCESSFULLY'
  );

  Logger.log(
    '=========================================='
  );

  Logger.log(
    'FORM ID: ' + form.getId()
  );

  Logger.log(
    'FORM URL: ' + form.getPublishedUrl()
  );

  Logger.log(
    'EDIT URL: ' + form.getEditUrl()
  );

  Logger.log(
    'SPREADSHEET ID: ' + SPREADSHEET_ID
  );

  Logger.log(
    '=========================================='
  );

}


/* =====================================================
   2. GENERATE GOOGLE FORM ENTRY IDs
   ===================================================== */

function generateGoogleFormConfig() {

  const props =
    PropertiesService.getScriptProperties();


  const formId =
    props.getProperty('LESC0_FORM_ID');


  if (!formId) {

    throw new Error(
      'Google Form ID not found. Run createLescoFeedbackForm() first.'
    );

  }


  const form =
    FormApp.openById(formId);


  const items =
    form.getItems();


  if (!items || items.length === 0) {

    throw new Error(
      'Google Form has no questions.'
    );

  }


  /* ===================================================
     CREATE A PREFILLED RESPONSE
     =================================================== */

  const response =
    form.createResponse();


  items.forEach(function(item) {

    try {

      const type =
        item.getType();


      if (
        type === FormApp.ItemType.TEXT
      ) {

        response.withItemResponse(
          item
            .asTextItem()
            .createResponse('TEST')
        );

      }


      else if (
        type === FormApp.ItemType.PARAGRAPH_TEXT
      ) {

        response.withItemResponse(
          item
            .asParagraphTextItem()
            .createResponse('TEST')
        );

      }


      else if (
        type === FormApp.ItemType.LIST
      ) {

        const listItem =
          item.asListItem();


        const choices =
          listItem.getChoices();


        if (choices.length > 0) {

          response.withItemResponse(
            listItem.createResponse(
              choices[0].getValue()
            )
          );

        }

      }


      else if (
        type === FormApp.ItemType.MULTIPLE_CHOICE
      ) {

        const mcItem =
          item.asMultipleChoiceItem();


        const choices =
          mcItem.getChoices();


        if (choices.length > 0) {

          response.withItemResponse(
            mcItem.createResponse(
              choices[0].getValue()
            )
          );

        }

      }


      else if (
        type === FormApp.ItemType.CHECKBOX
      ) {

        const cbItem =
          item.asCheckboxItem();


        const choices =
          cbItem.getChoices();


        if (choices.length > 0) {

          response.withItemResponse(
            cbItem.createResponse([
              choices[0].getValue()
            ])
          );

        }

      }


      else if (
        type === FormApp.ItemType.DATE
      ) {

        response.withItemResponse(
          item
            .asDateItem()
            .createResponse(new Date())
        );

      }


    } catch (err) {

      Logger.log(
        'Skipped item: ' +
        item.getTitle() +
        ' | ' +
        err.message
      );

    }

  });


  /* ===================================================
     GET PREFILLED URL
     =================================================== */

  const prefilledUrl =
    response.toPrefilledUrl();


  Logger.log(
    'PREFILLED URL:'
  );

  Logger.log(
    prefilledUrl
  );


  /* ===================================================
     EXTRACT ENTRY IDs
     =================================================== */

  const entryIds =
    extractEntryIds_(prefilledUrl);


  Logger.log(
    'ENTRY IDs FOUND: ' +
    entryIds.length
  );


  Logger.log(
    'FORM ITEMS FOUND: ' +
    items.length
  );


  if (entryIds.length < items.length) {

    Logger.log(
      'WARNING: Some Google Form items may not have an entry ID.'
    );

  }


  /* ===================================================
     BUILD FIELD CONFIG
     =================================================== */

  const fields = {};


  items.forEach(function(item, index) {

    const title =
      item.getTitle();


    const entryId =
      entryIds[index];


    if (!entryId) {

      Logger.log(
        'No Entry ID found for: ' +
        title
      );

      return;

    }


    const key =
      fieldKeyFromTitle_(title);


    fields[key] =
      entryId;

  });


  /* ===================================================
     FORM POST URL
     =================================================== */

  const publishedUrl =
    form.getPublishedUrl();


  const postUrl =
    publishedUrl.replace(
      /\/viewform(?:\?.*)?$/,
      '/formResponse'
    );


  /* ===================================================
     FINAL CONFIG
     =================================================== */

  const config = {

    postUrl: postUrl,

    fields: fields

  };


  /* ===================================================
     SAVE CONFIG IN SCRIPT PROPERTIES
     =================================================== */

  PropertiesService
    .getScriptProperties()
    .setProperty(
      'GOOGLE_FORM_CONFIG',
      JSON.stringify(config)
    );


  /* ===================================================
     GENERATE JAVASCRIPT BLOCK
     =================================================== */

  let output = '';


  output +=
    "var GOOGLE_FORM_POST_URL = " +
    JSON.stringify(postUrl) +
    ";\n\n";


  output +=
    "var GOOGLE_FORM_FIELDS = " +
    JSON.stringify(fields, null, 2) +
    ";\n";


  /* ===================================================
     LOG FINAL CONFIG
     =================================================== */

  Logger.log(
    '=========================================='
  );

  Logger.log(
    'COPY THIS BLOCK'
  );

  Logger.log(
    '=========================================='
  );

  Logger.log(
    output
  );

  Logger.log(
    '=========================================='
  );

  Logger.log(
    'END CONFIG'
  );

  Logger.log(
    '=========================================='
  );


  return output;

}


/* =====================================================
   3. EXTRACT ENTRY IDs FROM PREFILLED URL
   ===================================================== */

function extractEntryIds_(url) {

  const ids = [];

  const regex =
    /[?&](entry\.\d+)=/g;


  let match;


  while (
    (match = regex.exec(url)) !== null
  ) {

    const id =
      match[1];


    if (
      ids.indexOf(id) === -1
    ) {

      ids.push(id);

    }

  }


  return ids;

}


/* =====================================================
   4. CONVERT FORM QUESTION TITLE TO HTML FIELD KEY
   ===================================================== */

function fieldKeyFromTitle_(title) {

  const map = {

    'Sub-Division':
      'subDivision',

    'Division':
      'division',

    'Name':
      'name',

    'Designation':
      'designation',

    'Mobile Number':
      'mobile',

    'Email':
      'email',

    'Training / Session Name':
      'trainingSession',

    'Trainer':
      'trainer',

    'Training Date':
      'trainingDate',

    'Content Quality':
      'contentQuality',

    'Trainer Explanation / Clarity':
      'trainerClarity',

    'Practical Usefulness':
      'practicalUsefulness',

    'Training Duration':
      'duration',

    'Training Material / Demonstration Quality':
      'materialQuality',

    'Overall Satisfaction':
      'overallSatisfaction',

    'Useful Training Topics':
      'topics',

    'Most Useful Part of Training':
      'mostUseful',

    'Problems / Errors':
      'problems',

    'Suggestions for Improvement':
      'suggestions',

    'Future Training Requirements':
      'futureTraining',

    'Additional Comments':
      'comments',

    'Would you like to attend similar training again?':
      'futureParticipation'

  };


  if (
    map.hasOwnProperty(title)
  ) {

    return map[title];

  }


  // fallback
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g,
      function(match, chr) {
        return chr.toUpperCase();
      });

}


/* =====================================================
   5. SHOW CURRENT FORM INFORMATION
   ===================================================== */

function showLescoFormInfo() {

  const props =
    PropertiesService.getScriptProperties();


  const formId =
    props.getProperty('LESC0_FORM_ID');


  if (!formId) {

    Logger.log(
      'No Google Form has been created yet.'
    );

    return;

  }


  const form =
    FormApp.openById(formId);


  Logger.log(
    '=========================================='
  );

  Logger.log(
    'LESCO TRAINING FEEDBACK FORM'
  );

  Logger.log(
    '=========================================='
  );

  Logger.log(
    'Form ID: ' +
    form.getId()
  );

  Logger.log(
    'Form URL: ' +
    form.getPublishedUrl()
  );

  Logger.log(
    'Edit URL: ' +
    form.getEditUrl()
  );

  Logger.log(
    '=========================================='
  );

}


/* =====================================================
   6. SHOW SAVED CONFIG
   ===================================================== */

function showGoogleFormConfig() {

  const config =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        'GOOGLE_FORM_CONFIG'
      );


  if (!config) {

    Logger.log(
      'No Google Form configuration found.'
    );

    return;

  }


  Logger.log(
    JSON.stringify(
      JSON.parse(config),
      null,
      2
    )
  );

}


/* =====================================================
   END
   ===================================================== */
