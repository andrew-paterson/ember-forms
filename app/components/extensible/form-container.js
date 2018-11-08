import Component from '@ember/component';
import httpErrorMessageGenerator from 'ember-starter/utils/http-error-message-generator';

export default Component.extend({
  classNames: ['form-container'],
  classNameBindings: ['class'],

  actions: {
    saveSuccess: function(response, formFields, formMetaData) {
      var successMessage = {
        'type': 'success',
        'content': formMetaData.submitSuccessMessage,
      };
      this.setProperty('systemMessage', successMessage);
    },

    saveFail: function(errorResponse) {
      var error = errorResponse.errors[0];
      var errorDetail = httpErrorMessageGenerator(error);
      var errorMessage = {
        'name': 'errorErrors',
        'type': 'error',
        'sticky': true,
        'content': errorDetail
      };
      this.setProperty('systemMessage', errorMessage);
    },

    formValidationFailed: function(formFields) {
      var errorMessage = {
        'name': 'errorMessage',
        'type': 'error',
        'sticky': true,
        'content': 'Some fields have errors which must be fixed before continuing.'
      };
      this.setProperty('systemMessage', errorMessage);
    },

    formValidationPassed: function() {
      this.setProperty('systemMessage', null);
    },

    resetForm: function() {
      // this.set("formFields", generateEmberValidatingFormFields(formSchema));
      // this.set('processedFormSchema', generateEmberValidatingFormFields(formSchema));
    }
  }
});
