import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
// import { typeInSearch, clickTrigger } from 'ember-power-select/test-support/helpers';
import { render, click, triggerKeyEvent, focus, blur, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | blocks/validating-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let globalVariables = this.owner.lookup('service:global-variables');
    this.set('formSchema', {
      title: 'Sign up form',
      formName: 'signUpForm',
      // submitSuccessMessage: 'You have successfully signed up.',
      // submitButtonText: 'Request account',
      modelName: 'user',
      resetAfterSubmit: true,
      fields: [
        {
          fieldId: 'name',
          label: 'Name',
          fieldType: 'input',
          hideLabel: true,
          validationRules: [{'validationMethod': 'required'}],
          validationEvents: ['focusOut', 'keyUp', 'insert'],
          inputType: 'text',
          trim: true,
        },
        {
          fieldId: 'email',
          label: 'Email',
          fieldType: 'input',
          hideLabel: true,
          validationRules: [{'validationMethod': 'isEmail'}],
          inputType: 'text',
          trim: true,
        },
        {
          fieldId: 'bio',
          label: 'Bio',
          fieldType: 'textarea',
          hideLabel: true,
          inputType: 'text',
          trim: true,
        },
        {
          label: "Phone number",
          fieldId: "personal_details.phone_number",
          fieldType: "input",
          showLabel: false,
          validationRules: [{'validationMethod': 'isNumeric'}],
          inputType: "number",
          trim: true,
        },
        {
          fieldType: 'textSeparator',
          text: "Physical Address",
          textElement: 'h3'
        },
        {
          label: "Address line 1",
          fieldId: "personal_details.address.address_line1",
          fieldType: "input",
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}],
          inputType: "text",
          trim: true,
        },
        {
          label: "Country",
          fieldId: 'personal_details.address.country',
          fieldType: "select",
          hideLabel: true,
          validationRules: [{'validationMethod': 'required'}],
          options: globalVariables.countries,
        },
        {
          fieldId: 'acceptTerms',
          fieldType: "radioButtonGroup",
          label: 'Do you agree to the terms?',
          showLabel: true,
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
          hideLabel: true,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isDate'}],
          validationEvents: ['insert'],
          showLabel: true
        },
        {
          fieldId: 'test',
          fieldType: "singleCheckbox",
          validationRules: [{'validationMethod': 'required'}],
          label: 'test'
        }
      ]
    });
    this.set('dummyAction_formValidationFailed', (formFields, formMetaData) => {
      assert.deepEqual(formMetaData.submitButtonFeedback, 'Some fields have errors which must be fixed before continuing.', 'Follow up action is sent when form validation fails, and receives updated formFields and formMetaData.');
    });

    this.set('testAction', (actual) => {
      // let expected = { comment: 'You are not a wizard!' };
      // console.log(actual);
      // assert.deepEqual(actual, expected, 'Submitted value is passed to external action');
    });

    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('form'), 'Form element is rendered.');
    assert.ok(this.element.querySelector('h3').textContent === 'Sign up form', 'Form header renders.');
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"] input').type === 'submit', 'Submit form button renders as an input with type="submit".');
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"] input').value === 'Submit', 'Correct default text renders on submit form button.');

    this.set('formSchema.submitButtonText', 'Request account'),
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-submit-form-button"] input').value === 'Request account', 'Custom text renders on the submit button if specified in form schema.');

    this.set('formSchema.showResetButton', true),
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-reset-form-button"]').textContent === 'Reset', 'If "showResetButton" is true, show the reset button with the correct default button text.');

    this.set('formSchema.resetButtonText', 'Cancel'),
    await render(hbs`{{blocks/generic/validating-form formSchema=formSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="evf-reset-form-button"]').textContent === 'Cancel', 'Custom text renders on the reset button if specified in form schema.');

    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationFailed=(action dummyAction_formValidationFailed)
      saveSuccess=(action testAction)
      saveFail=(action testAction)
      formValidationPassed=(action testAction)
      customValidations=(action testAction)
    }}`);

    await click(this.element.querySelector('[data-test-id="evf-submit-form-button"] input'));
    assert.deepEqual(this.element.querySelectorAll('[data-test-id="field-error"]').length, this.element.querySelectorAll('.validates').length, 'All fields with  get errors when submit is clicked with no other interaction.');
    assert.ok(this.element.querySelector('div').classList.contains('validation-failed'), 'Form gets class "validation-failed" when validation fails.');

    await render(hbs`{{blocks/generic/validating-form
      formSchema=formSchema
      formValidationFailed=(action dummyAction_formValidationFailed)
      saveSuccess=(action testAction)
      saveFail=(action testAction)
      formValidationPassed=(action testAction)
      customValidations=(action testAction)
    }}`);

    // TODO find a way to test Enter key press to submit form.
    await fillIn(this.element.querySelector('[data-test-id="validating-field-name"] input'), 'Little Sebastian');
    await fillIn(this.element.querySelector('[data-test-id="validating-field-email"] input'), 'lsebastian@pawneegov.org');
    await fillIn(this.element.querySelector('[data-test-id="validating-field-bio"] textarea'), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente exercitationem, architecto maiores delectus optio id similique eveniet repellat distinctio perspiciatis, iusto eligendi consequatur hic ipsam ut atque! A, quod porro.');
    await fillIn(this.element.querySelector('[data-test-id="validating-field-personal_details.phone_number"] input'), '354674234');
    await fillIn(this.element.querySelector('[data-test-id="validating-field-personal_details.address.address_line1"] input'), 'City Hall');
    await click(this.element.querySelector('[data-test-id="validating-field-personal_details.address.country"] .ember-power-select-trigger'));
    await click(this.element.querySelector('li[data-option-index="0"]'));
    // await selectChoose('[data-test-id="validating-field-personal_details.address.country"]', 'United States');
    return this.pauseTest();


    await click(this.element.querySelector('[data-test-id="validating-field-acceptTerms"] [data-test-id="radio-button-option-true"] input'));





  });
});
