import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { openDatepicker } from 'ember-pikaday/helpers/pikaday';
import { render, click, triggerKeyEvent, focus, blur, fillIn, isSettled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | blocks/validating-form', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  test('it renders', async function(assert) {
    let globalVariables = this.owner.lookup('service:global-variables');

    this.set('formSchema', {
      title: 'Sign up form',
      formName: 'signUpForm',
      modelName: 'user',
      fields: [
        {
          fieldId: 'name',
          label: 'Name',
          fieldType: 'input',
          validationRules: [{'validationMethod': 'required'}],
          validationEvents: ['focusOut', 'keyUp', 'insert'],
          inputType: 'text',
        },
        {
          fieldId: 'email',
          label: 'Email',
          fieldType: 'input',
          validationRules: [{'validationMethod': 'isEmail'}],
          inputType: 'text',
        },
        {
          fieldId: 'bio',
          label: 'Bio',
          fieldType: 'textarea',
          inputType: 'text',
        },
        {
          label: "Phone number",
          fieldId: "personal_details.phone_number",
          fieldType: "input",
          validationRules: [{'validationMethod': 'isNumeric'}],
          inputType: "number",
        },
        {
          fieldId: 'text',
          fieldType: 'textSeparator',
          text: "Physical Address",
          textElement: 'h3'
        },
        {
          label: "Address line 1",
          fieldId: "personal_details.address.address_line1",
          fieldType: "input",
          validationRules: [{'validationMethod': 'required'}],
          inputType: "text",
        },
        {
          label: "Country",
          fieldId: 'personal_details.address.country',
          fieldType: "select",
          validationRules: [{'validationMethod': 'required'}],
          options: globalVariables.countries,
        },
        {
          fieldId: 'acceptTerms',
          fieldType: "radioButtonGroup",
          label: 'Do you agree to the terms?',
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'equals', 'arguments': 'true', 'errorMessage': 'You must accept the terms to continue.'}],
          radioButtons: [{
            'label': 'I agree',
            'value': 'true'
          }, {
            'label': 'I do not agree',
            'value': 'false'
          }]
        },
        {
          label: "Activation date",
          fieldId: "activation_date",
          fieldType: "date",
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isDate'}],
          validationEvents: ['insert'],
        },
        {
          fieldId: 'settings.mailing_list',
          fieldType: "singleCheckbox",
          validationRules: [{'validationMethod': 'required'}],
          label: 'Do you agree join the mailing list?'
        }
      ]
    });
    this.set('dummyAction_formValidationFailed', (formFields, formMetaData) => {
      assert.deepEqual(formMetaData.submitButtonFeedback, 'Some fields have errors which must be fixed before continuing.', 'Follow up action is sent when form validation fails, and receives updated formFields and formMetaData.');
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

    this.set('dummyAction_saveSuccess', (response, formFields, formMetaData) => {
      console.log('dummyAction_saveSuccess');
      assert.ok('' === '', 'Save success action is fired');
    });

    this.set('dummyAction_saveFail', (response, formFields, formMetaData) => {
      console.log('dummyAction_saveFail');
      assert.ok('' === '', 'Save success action is fired');
    });

    this.set('testAction', (actual) => {

    });

    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('form'), 'Form element is rendered.');
    assert.ok(this.element.querySelector('h3').textContent === 'Sign up form', 'Form header renders.');
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"] input').type === 'submit', 'Submit form button renders as an input with type="submit".');
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"] input').value === 'Submit', 'Correct default text renders on submit form button.');

    this.set('formSchema.submitButtonText', 'Request account');
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"] input').value === 'Request account', 'Custom text renders on the submit button if specified in form schema.');

    this.set('formSchema.showResetButton', true);
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-reset-form-button"]').textContent === 'Reset', 'If "showResetButton" is true, show the reset button with the correct default button text.');

    this.set('formSchema.resetButtonText', 'Cancel');
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-reset-form-button"]').textContent === 'Cancel', 'Custom text renders on the reset button if specified in form schema.');
    assert.ok(this.element.querySelector('[data-test-id="validating-field-name"] label').textContent === 'Name', 'Labels show on fields by default.');

    this.set('formSchema.hideLabels', true);
    var emailField = this.get('formSchema.fields').find((field) => {
      return field.fieldId === 'email';
    })
    emailField.hideLabel = false;

    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationFailed=(action dummyAction_formValidationFailed)
      saveSuccess=(action dummyAction_saveSuccess)
      saveFail=(action testAction)
      formValidationPassed=(action testAction)
      customValidations=(action testAction)
    }}`);

    assert.notOk(this.element.querySelector('[data-test-id="validating-field-name"] label'), 'Labels hidden if formSchema has "hideLabels" set to true.');
    assert.ok(this.element.querySelector('[data-test-id="validating-field-email"] label'), 'Field setting of "hideLabel" overrides form setting.');

    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"] input'));
    await isSettled();
    assert.deepEqual(this.element.querySelectorAll('[data-test-id="field-error"]').length, this.element.querySelectorAll('.validates').length, 'All required but empty fields get errors, when submit is clicked with no other interaction.');
    assert.ok(this.element.querySelector('div').classList.contains('validation-failed'), 'Form gets class "validation-failed" when validation fails.');

    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationFailed=(action dummyAction_formValidationFailed)
      saveSuccess=(action dummyAction_saveSuccess)
      saveFail=(action testAction)
      formValidationPassed=(action testAction)
      customValidations=(action testAction)
      submitAction=(action dummyAction_submitAction)
    }}`);

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
    await click(this.element.querySelector('[data-test-id="validating-field-activation_date"]'));
    var interactor = await openDatepicker(this.element.querySelector('[data-test-id="validating-field-activation_date"] input'));
    await interactor.selectDate(new Date(2010, 3, 28));
    await click('[data-test-id="validating-field-settings.mailing_list"] input');
    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"] input'));
    await isSettled();
    assert.equal(this.element.querySelector('[data-test-id="validating-field-name"] input').value, '', 'By default, form is cleared after success response returns from submitForm action.');

    this.set('formSchema.resetAfterSubmit', false);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await click('[data-test-id="validating-field-settings.mailing_list"] input');
    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"] input'));
    await isSettled();
    assert.equal(this.element.querySelector('[data-test-id="validating-field-name"] input').value, 'Little Sebastian', 'Form is not cleared after success response returns from submitForm action, if "resetAfterSubmit" is false.');

    this.set('formSchema.showResetButton', true);
    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationFailed=(action dummyAction_formValidationFailed)
      formValidationPassed=(action testAction)
      submitAction=(action dummyAction_submitAction)
      saveSuccess=(action dummyAction_saveSuccess)
      saveFail=(action dummyAction_saveFail)
      customValidations=(action testAction)

    }}`);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await click(this.element.querySelector('[data-test-id="evf-reset-form-button"]'));
    assert.deepEqual(this.element.querySelector('[data-test-id="validating-field-name"] input').value, '', 'Form resets when reset button is clicked');

    this.set('formSchema.hideSuccessValidation', true);
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.notOk(this.element.querySelector('[data-test-id="validating-field-name"]').classList.contains('valid'), 'Success validation hidden if formSchema has "hideSuccessValidation" set to true.');

    var emailField = this.get('formSchema.fields').find((field) => {
      return field.fieldId === 'email';
    })
    emailField.hideSuccessValidation = false;
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    await fillIn(this.element.querySelector('[data-test-id="validating-field-email"] input'), 'lsebastian@pawneegov.org');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await blur(this.element.querySelector('[data-test-id="validating-field-email"] input'));
    assert.ok(this.element.querySelector('[data-test-id="validating-field-email"]').classList.contains('valid'), 'Success validation shows where individual field setting overrides formSchema setting of "hideSuccessValidation=true".');

  });
});
