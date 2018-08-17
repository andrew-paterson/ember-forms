import { inject as service } from '@ember/service';
import FormContainer from 'ember-starter/components/extensible/form-container';
import httpErrorMessageGenerator from 'ember-starter/utils/http-error-message-generator';
import generateEmberValidatingFormFields from 'ember-starter/utils/generate-ember-validating-form-fields';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';

export default FormContainer.extend({
  globalVariables: service(),
  session: service(),

  init: function() {
    this._super(...arguments);

    this.model = EmberObject.create({
      internal_settings: {}
    });
  },

  formObject: computed('dynamicFormFields', 'dynamicFormFields.@each', 'dynamicFormFields.@each.options', 'dynamicFormFields.@each.fieldType','dynamicFormFields.@each.label', function() {
    var dynamicFormSchema = {
      title: 'Dynamic Form',
      formName: 'dynamicForm',
      submitSuccessMessage: 'You have successfully signed up.',
      submitButtonText: 'Request account',
      modelName: 'user',
      resetAfterSubmit: true,
      fields: this.get('dynamicFormFields')
    };
    return generateEmberValidatingFormFields(dynamicFormSchema);
  }),

  actions: {
    customValidations: function(fieldObject, formFields) {
      if (fieldObject.propertyName === 'password' || 'password_confirmation') {
        var passwordFieldObject = formFields.findBy('propertyName', 'password');
        var passwordConfirmationFieldObject = formFields.findBy('propertyName', 'password_confirmation');
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