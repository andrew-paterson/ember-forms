import { module, test } from 'qunit';
import { visit, fillIn, click, isSettled} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Validating form', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Validating form | Create record', async function(assert) {
    let session = this.owner.lookup('service:session');
    session.set('signupFormSchema.resetAfterSubmit', false);
    server.createList('user', 0);
    await visit('/signup');

    await fillIn(document.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await fillIn(document.querySelector('[data-test-id="validating-field-email"] input'), 'lsebastian@pawneegov.org');
    await fillIn(document.querySelector('[data-test-id="validating-field-bio"] textarea'), `Bye bye Li'l Sebastian; Miss you in the saddest fashion; Bye bye Li'l ; Sebastian; You’re 5000 candles in the wind.`);

    await fillIn(document.querySelector('[data-test-id="validating-field-personal_details.phone_number"] input'), '354674234');
    await fillIn(document.querySelector('[data-test-id="validating-field-personal_details.address.address_line1"] input'), 'City Hall');
    await click(document.querySelector('[data-test-id="validating-field-personal_details.address.country"] .ember-power-select-trigger'));
    await click(document.querySelector('[data-option-index="0"]'));
    await click(document.querySelector('[data-test-id="validating-field-acceptTerms"] [data-test-id="radio-button-option-true"] input'));
    await click(document.querySelector('[data-test-id="validating-field-personal_details.birth_date"]'));
    // TODO update these to use the test helper provided, when the addon is updated so that tests use the Ember 3 way.

    await click('[data-test-id="validating-field-personal_details.birth_date"] [data-test-type="power-datepicker-date-trigger"]');
    await click('[data-date="2018-09-13"]');

    await click(document.querySelector('[data-test-id="validating-field-personal_details.favourite_colours"] input'));
    await click(document.querySelector('[data-test-id="validating-field-settings.mailing_list"] input'));
    await click(document.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();

    assert.equal(document.querySelector('[data-test-id="system-message"] .message-content').textContent.trim(), 'Success', 'Default success message displays on successful form submission, if "submitSuccessMessage" is null.');

    await visit('/users');
    assert.equal(document.querySelectorAll('[data-test-id="users-table"] tbody tr').length, 1, 'Submitting creates a new record.');
    assert.equal(document.querySelector('[data-test-id="users-table"] tr:first-child [data-test-id="name"]').textContent.trim(), 'Little Sebastian', 'Correct values are saved in the new record.');

    await visit('/signup');
    await fillIn(document.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await fillIn(document.querySelector('[data-test-id="validating-field-bio"] textarea'), `Bye bye Li'l Sebastian; Miss you in the saddest fashion; Bye bye Li'l ; Sebastian; You’re 5000 candles in the wind.`);
    await fillIn(document.querySelector('[data-test-id="validating-field-personal_details.phone_number"] input'), '354674234');
    await fillIn(document.querySelector('[data-test-id="validating-field-personal_details.address.address_line1"] input'), 'City Hall');
    await click(document.querySelector('[data-test-id="validating-field-personal_details.address.country"] .ember-power-select-trigger'));
    await click(document.querySelector('[data-option-index="0"]'));
    await click(document.querySelector('[data-test-id="validating-field-acceptTerms"] [data-test-id="radio-button-option-true"] input'));
    await click(document.querySelector('[data-test-id="validating-field-personal_details.birth_date"]'));
    // TODO update these to use the test helper provided, when the addon is updated so that tests use the Ember 3 way.
    await click('[data-test-id="validating-field-personal_details.birth_date"] [data-test-type="power-datepicker-date-trigger"]');
    await click('[data-date="2018-09-13"]');
    await click(document.querySelector('[data-test-id="validating-field-personal_details.favourite_colours"] input'));
    await click(document.querySelector('[data-test-id="validating-field-settings.mailing_list"] input'));
    await fillIn(document.querySelector('[data-test-id="validating-field-email"] input'), 'alreadytaken@yahoo.com');
    await click(document.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();
    assert.equal(document.querySelector('[data-test-id="system-message"] .message-content').textContent.trim(), 'Email already taken.', 'Error message shows where POST request returns error.');
    assert.ok(document.querySelector('[data-test-id="validating-field-email"]').classList.contains('invalid'), 'Email field gets invalid class when server returns "Email already taken" error.');
    assert.ok(document.querySelector('[data-test-id="validating-field-email"] [data-test-id="field-error"]'), 'Email field gets error message when server returns "Email already taken" error.');

    session.set('signupFormSchema.submitSuccessMessage', 'Thank you for signing up.');
    session.set('signupFormSchema.resetAfterSubmit', null);
    await visit('/');
    await visit('/signup');
    await fillIn(document.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await fillIn(document.querySelector('[data-test-id="validating-field-email"] input'), 'lsebastian@pawneegov.org');
    await fillIn(document.querySelector('[data-test-id="validating-field-bio"] textarea'), `Bye bye Li'l Sebastian; Miss you in the saddest fashion; Bye bye Li'l ; Sebastian; You’re 5000 candles in the wind.`);
    await fillIn(document.querySelector('[data-test-id="validating-field-personal_details.phone_number"] input'), '354674234');
    await fillIn(document.querySelector('[data-test-id="validating-field-personal_details.address.address_line1"] input'), 'City Hall');
    await click(document.querySelector('[data-test-id="validating-field-personal_details.address.country"] .ember-power-select-trigger'));
    await click(document.querySelector('[data-option-index="0"]'));
    await click(document.querySelector('[data-test-id="validating-field-acceptTerms"] [data-test-id="radio-button-option-true"] input'));
    // TODO update these to use the test helper provided, when the addon is updated so that tests use the Ember 3 way.
    await click('[data-test-id="validating-field-personal_details.birth_date"] [data-test-type="power-datepicker-date-trigger"]');
    await click('[data-date="2018-09-13"]');
    await click(document.querySelector('[data-test-id="validating-field-personal_details.favourite_colours"] input'));
    await click(document.querySelector('[data-test-id="validating-field-settings.mailing_list"] input'));
    await click(document.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();
    assert.equal(document.querySelector('[data-test-id="system-message"] .message-content').textContent.trim(), 'Thank you for signing up.', 'Custom success message displays on successful form submission if "submitSuccessMessage" is specified.');

    var allClear = function() {
      var allValues = [];
      var textInputs = document.querySelectorAll('[data-test-validating-field] .ember-text-area, [data-test-validating-field] .ember-text-field');
      textInputs.forEach(function(textInput) {
        if (textInput.value !== "") {
          allValues.push(textInput.value);
        }
      });
      var selectedInputs = document.querySelectorAll('[data-test-type="form-field-power-select"] .ember-power-select-selected-item, [data-test-validating-field] [data-test-id="radio-button"] input:checked, [data-test-validating-field] [data-test-id="checkbox"] input:checked');
      var datepickerTriggers = document.querySelectorAll('[data-test-type="form-field-power-datepicker"] button.date-button');

      datepickerTriggers.forEach(function(datepickerTrigger) {
        if (datepickerTrigger.textContent.trim() !== "Select Date") {
          allValues.push(datepickerTrigger.textContent.trim());
        }
      });

      if (selectedInputs.length > 0 || allValues.length > 0) {
        return false;
      }
      return true;
    }
    assert.ok(allClear(), 'By default, form is cleared after success response returns from "submitForm" action.');
  });

  test('Validating form | Update record', async function(assert) {
    setupApplicationTest(hooks);
    setupMirage(hooks);
    server.createList('user', 1);
    await visit('/users');
    // TODO test all fields
    var firstUsersName = document.querySelector('[data-test-id="users-table"] tbody tr:first-child [data-test-id="name"]').textContent.trim();
    await visit('/edit-account');
    assert.equal(document.querySelector('[data-test-id="validating-field-name"] input').value, firstUsersName, 'Given record pre-populates the form.')
    // TODO need a way to properly test this.
    assert.ok(document.querySelector('[data-test-id="validating-form"]'), 'Form renders when given processedFormSchema, rather than formSchema.');
    await fillIn(document.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await click(document.querySelector('[data-test-id="validating-field-settings.mailing_list"] input'));
    await click(document.querySelector('[data-test-id="validating-field-acceptTerms"] [data-test-id="radio-button-option-true"] input'));
    await click(document.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();
    assert.equal(document.querySelector('[data-test-id="validating-field-name"] input').value, 'Little Sebastian', 'Form is not cleared after submit success.');
    await visit('/users');
    assert.equal(document.querySelectorAll('[data-test-id="users-table"] tbody tr').length, 1, 'Submit does not insert a new record.');

    assert.equal(document.querySelector('[data-test-id="users-table"] tbody tr:first-child [data-test-id="name"]').textContent.trim(), 'Little Sebastian', 'User edits are successfully saved when user clicks "Submit".');

  });
});