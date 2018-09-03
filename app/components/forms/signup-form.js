import { inject as service } from '@ember/service';
import FormContainer from 'ember-starter/components/extensible/form-container';
import httpErrorMessageGenerator from 'ember-starter/utils/http-error-message-generator';
import generateEmberValidatingFormFields from 'ember-starter/utils/generate-ember-validating-form-fields';
import generateEmberValidatingFormField from 'ember-starter/utils/generate-ember-validating-form-field';

import EmberObject from '@ember/object';

export default FormContainer.extend({
  globalVariables: service(),
  session: service(),

  init: function() {
    this._super(...arguments);
    // this.model = EmberObject.create({
    //   internal_settings: {}
    // });
    this.signUpFormSchema = {
      title: 'Sign Up',
      formName: 'signUpForm',
      submitSuccessMessage: 'You have successfully signed up.',
      submitButtonText: 'Request account',
      modelName: 'user',
      resetAfterSubmit: true,
      fields: [
        {
          fieldId: 'name',
          label: 'Name',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}],
          validationEvents: ['focusOut', 'keyUp', 'insert'],
          inputType: 'text',
          trim: true,
        },
        {
          fieldId: 'email',
          label: 'Email',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isEmail'}],
          inputType: 'text',
          trim: true,
        },
        {
          fieldId: 'bio',
          label: 'Bio',
          fieldType: 'textarea',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isEmail'}],
          inputType: 'text',
          trim: true,
        },
        {
          fieldId: 'password',
          label: 'Password (Minimum 8 characters)',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isLength', 'arguments': {min: 8, max: 72}}, {'validationMethod': 'custom'}],
          inputType: 'password',
        },
        {
          fieldId: 'password_confirmation',
          label: 'Confirm password',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isLength', 'arguments': {min: 8, max: 72}}, {'validationMethod': 'custom'}],
          inputType: 'password',
          trim: true,
        },
        {
          fieldId: 'country',
          label: "Country",
          fieldType: "select",
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}],
          options: this.get('globalVariables.countries'),
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
          default: moment().toDate(),
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isDate'}],
          validationEvents: ['insert'],
          showLabel: true
        },
        {
          fieldType: 'textSeparator',
          text: "Hello world",
          textElement: 'h3'
        },
        {
          fieldId: 'test',
          fieldType: "singleCheckbox",
          validationRules: [{'validationMethod': 'required'}],
          label: 'test'
        }
      ]
    };
    var formSchema = this.get('signUpFormSchema');
    // this.processedFormSchema = generateEmberValidatingFormFields(formSchema);

    this.standaloneField = {
      fieldId: 'standalone',
      label: 'Standalone',
      fieldType: 'input',
      showLabel: false,
      validationRules: [{'validationMethod': 'required'}],
      validationEvents: ['focusOut', 'keyUp', 'insert'],
      inputType: 'text',
      trim: true,
    }
    this.processedStandaloneField = generateEmberValidatingFormField(this.get('standaloneField'));
  },

  actions: {
    customValidations: function(fieldObject, formFields) {
      var error;
      if (fieldObject.fieldId === 'password' || fieldObject.fieldId === 'password_confirmation') {
        var passwordFieldObject = formFields.findBy('fieldId', 'password');
        var passwordConfirmationFieldObject = formFields.findBy('fieldId', 'password_confirmation');
        var password = passwordFieldObject.value;
        var passwordConfirmation = passwordConfirmationFieldObject.value;
        if (password && passwordConfirmation) {
          if (password !== passwordConfirmation) {
            passwordFieldObject.set('error', 'The passwords do not match.');
            passwordConfirmationFieldObject.set('error', 'The passwords do not match.');
          } else {
            passwordFieldObject.set('error', false);
            passwordConfirmationFieldObject.set('error', false);
          }
        } else {
          passwordFieldObject.set('error', null);
          passwordConfirmationFieldObject.set('error', null);
        }
      }
    },

    saveFail: function(errorResponse, formFields) {
      var error = errorResponse.errors[0];
      var errorDetail = httpErrorMessageGenerator(error);
      //TODO test if this is happening.
      if (error.detail === 'Email has already been taken') {
        var fieldObject = formFields.findBy('propertyName', 'email');
        fieldObject.set('error', );
      }
      // Todo - if error code is 40* use error detail, if not use hard coded fallback.
      var errorMessage = {
        'name': 'signupFormErrors',
        'type': 'error',
        'sticky': true,
        'content': errorDetail
      };
      this.setProperty('systemMessage', errorMessage);
    },
  }
});