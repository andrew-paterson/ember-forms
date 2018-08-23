import { inject as service } from '@ember/service';
import FormContainer from 'ember-starter/components/extensible/form-container';
import httpErrorMessageGenerator from 'ember-starter/utils/http-error-message-generator';
import generateEmberValidatingFormFields from 'ember-starter/utils/generate-ember-validating-form-fields';
import EmberObject from '@ember/object';

export default FormContainer.extend({
  globalVariables: service(),
  session: service(),

  init: function() {
    this._super(...arguments);

    this.model = EmberObject.create({
      internal_settings: {}
    });
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
          propertyName: 'name',
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
          propertyName: 'email',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isEmail'}],
          inputType: 'text',
          trim: true,
        },
        {
          fieldId: 'password',
          label: 'Password (Minimum 8 characters)',
          propertyName: 'password',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isLength', 'arguments': {min: 8, max: 72}}, {'validationMethod': 'custom'}],
          inputType: 'password',
        },
        {
          fieldId: 'password_confirmation',
          label: 'Confirm password',
          propertyName: 'password_confirmation',
          fieldType: 'input',
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isLength', 'arguments': {min: 8, max: 72}}, {'validationMethod': 'custom'}],
          inputType: 'password',
          trim: true,
        },
        {
          fieldId: 'country',
          label: "Country",
          propertyName: "info.country",
          fieldType: "select",
          showLabel: false,
          validationRules: [{'validationMethod': 'required'}],
          options: this.get('globalVariables.countries'),
        },
        {
          fieldId: 'acceptTerms',
          fieldType: "radioButtonGroup",
          propertyName: "acceptTerms",
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
      ]
    };
    // var formSchema = JSON.parse(localStorage.getItem('signUpForm'));
    var formSchema = this.get('signUpFormSchema');
    this.formObject = generateEmberValidatingFormFields(formSchema);
    // localStorage.setItem(this.get('signUpFormSchema').formName, JSON.stringify(this.get('signUpFormSchema')));
  },

  actions: {
    customValidations: function(fieldObject, formFields) {
      var error;
      if (fieldObject.fieldId === 'password' || 'password_confirmation') {
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