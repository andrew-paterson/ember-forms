import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, focus, blur, fillIn, isSettled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | blocks/validating-form', function(hooks) {
  setupRenderingTest(hooks);

  test('Initial rendering', async function(assert) {
    let session = this.owner.lookup('service:session');
    this.set('formSchema', session.signupFormSchema);

    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('form'), 'Form element is rendered.');
    assert.ok(this.element.querySelector('h3').textContent === 'Sign up form', 'Form header renders.');
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"]').type === 'submit', 'Submit form button renders as an input with type="submit".');
    assert.equal(this.element.querySelector('[data-test-id="evf-submit-form-button"]').textContent, 'Submit', 'Correct default text renders on submit form button.');
    this.set('formSchema.submitButtonText', 'Request account');
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"]').textContent === 'Request account', 'Custom text renders on the submit button if specified in form schema.');
    assert.notOk(this.element.querySelector('[data-test-id="evf-reset-form-button"]'), 'Reset button does not show by default.');
    this.set('formSchema.showResetButton', true);
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-reset-form-button"]').textContent === 'Reset', 'If "showResetButton" is true, show the reset button with the correct default button text.');

    this.set('formSchema.resetButtonText', 'Cancel');
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-reset-form-button"]').textContent === 'Cancel', 'Custom text renders on the reset button if specified in form schema.');
    assert.ok(this.element.querySelector('[data-test-id="validating-field-name"] label').textContent === 'Name', 'Labels show on fields by default.');
  });

  test('Form defaults', async function(assert) {
    let session = this.owner.lookup('service:session');
    this.set('formSchema', session.signupFormSchema);
    this.set('formSchema.hideLabels', true);
    this.set('formSchema.hideSuccessValidation', true);
    var emailField = this.get('formSchema.fields').find((field) => {
      return field.fieldId === 'email';
    })
    emailField.hideLabel = false;
    emailField.hideSuccessValidation = false;
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);

    assert.notOk(this.element.querySelector('[data-test-id="validating-field-name"] label'), 'Labels hidden on fields by default,  if formSchema has "hideLabels: true".');
    assert.ok(this.element.querySelector('[data-test-id="validating-field-email"] label'), 'Field setting of "hideLabel:false" overrides form setting of "hideLabels:true".');
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.notOk(this.element.querySelector('[data-test-id="validating-field-name"]').classList.contains('valid'), 'Success validation hidden in all fields, if formSchema has "hideSuccessValidation:true".');
    await fillIn(this.element.querySelector('[data-test-id="validating-field-email"] input'), 'lsebastian@pawneegov.org');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await blur(this.element.querySelector('[data-test-id="validating-field-email"] input'));
    assert.ok(this.element.querySelector('[data-test-id="validating-field-email"]').classList.contains('valid'), 'Success validation shows where individual field has "hideSuccessValidation:false", and formSchema has "hideSuccessValidation=true".');
  });

  test('Basic actions', async function(assert) {
    let session = this.owner.lookup('service:session');
    this.set('formSchema', session.signupFormSchema);
    this.set('formSchema.showResetButton', true);

    this.set('dummyAction_afterKeyUpAction', (value, event, formField) => {
      assert.ok('' === '', 'afterKeyUpAction action is fired');
    });

     this.set('testAction', (actual) => {
    });

    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationPassed=(action testAction)
      customValidations=(action testAction)
      afterKeyUpAction=(action dummyAction_afterKeyUpAction)
    }}`);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await click(this.element.querySelector('[data-test-id="evf-reset-form-button"]'));
    assert.deepEqual(this.element.querySelector('[data-test-id="validating-field-name"] input').value, '', 'Form resets when reset button is clicked');
  });

  test('Form validation on submit', async function(assert) {
    this.set('dummyAction_formValidationFailed', (formFields, formMetaData) => {
      assert.deepEqual(formMetaData.submitButtonFeedback, 'Some fields have errors which must be fixed before continuing.', 'Follow up action is sent when form validation fails, with formFields and formMetaData as arguments.');
    });

    this.set('dummyAction_submitAction', (values, modelName) => {
      assert.deepEqual(modelName, 'user', 'The "submitAction" is fired when user clicks submit an the form passes validation.');
      assert.deepEqual(values.email, 'lsebastian@pawneegov.org', 'Top level form values are included in the top level of the values object sent to "submitAction".');
      assert.deepEqual(values.settings.mailing_list, true, 'Second level form values are included in the second level of the values object sent to "submitAction".');
      assert.deepEqual(values.personal_details.address.address_line1, 'City Hall', 'Third level form values are included in the third level of the values object sent to "submitAction".');
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run(() => {
          resolve();
        });
      });
    });

    this.set('dummyAction_saveFail', (response, formFields, formMetaData) => {
      assert.ok('' === '', 'Save success action is fired');
    });

    this.set('testAction', (actual) => {
    });

    let session = this.owner.lookup('service:session');
    this.set('formSchema', session.signupFormSchema);
    var colorsField = this.get('formSchema.fields').findBy('fieldId', 'personal_details.favourite_colours');
    colorsField.validationRules = null;
    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationFailed=(action dummyAction_formValidationFailed)
      submitAction=(action dummyAction_submitAction)
      saveFail=(action testAction)
      formValidationPassed=(action testAction)
      customValidations=(action testAction)

    }}`);

    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();
    // await this.pauseTest();
    assert.deepEqual(this.element.querySelectorAll('[data-test-id="field-error"]').length, this.element.querySelectorAll('.validates').length, 'All required but empty fields get errors, when submit is clicked with no other interaction.');

    assert.ok(this.element.querySelector('div').classList.contains('validation-failed'), 'Form gets class "validation-failed" when validation fails.');
    // TODO find a way to test Enter key press to submit form.
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-email"] input'), 'lsebastian@pawneegov.org');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-bio"] textarea'), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente exercitationem, architecto maiores delectus optio id similique eveniet repellat distinctio perspiciatis, iusto eligendi consequatur hic ipsam ut atque! A, quod porro.');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-personal_details.phone_number"] input'), '354674234');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-personal_details.address.address_line1"] input'), 'City Hall');

    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);

    await click(this.element.querySelector('[data-test-id="validating-field-personal_details.address.country"] .ember-power-select-trigger'));

    await click(document.querySelector('[data-option-index="0"]'));
    await click(this.element.querySelector('[data-test-id="validating-field-acceptTerms"] [data-test-id="radio-button-option-true"] input'));

    await click('[data-test-id="validating-field-personal_details.birth_date"] .ember-power-datepicker-trigger');
    await click('[data-date="2018-09-13"]');

    await click('[data-test-id="validating-field-settings.mailing_list"] input');
    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();


    this.set('formSchema.resetAfterSubmit', false);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await click('[data-test-id="validating-field-settings.mailing_list"] input');
    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"]'));
    await isSettled();
    assert.equal(this.element.querySelector('[data-test-id="validating-field-name"] input').value, 'Little Sebastian', 'Form is not cleared after success response returns from submitForm action, if "resetAfterSubmit" is false.'); //TODO move to acceptance.
  });
});
