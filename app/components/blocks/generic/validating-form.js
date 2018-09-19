// TODO arguments sent with submitAction change depending on whether the forms creates a new record or updates an existing one. This is differentiated by whether or not the "recordToUpdate" property is set, in which case it sends the updated model record.
import Component from '@ember/component';
import { computed } from '@ember/object';
import Object from '@ember/object';
import generateEmberValidatingFormFields from 'ember-starter/utils/generate-ember-validating-form-fields';
import validateField from 'ember-starter/utils/validate-field';

export default Component.extend({
  classNameBindings: ['class', 'validationFailed:validation-failed'],
  attributeBindings: ["data-test-id"],

  formObject: computed('formSchema', 'processedFormSchema', function() {
    if (this.get('processedFormSchema')) {
      return this.get('processedFormSchema');
    } else {
      return generateEmberValidatingFormFields(this.get('formSchema'));
    }
  }),

  formName: computed('formObject', function() {
    var formName = this.get('formObject.formMetaData.formName');
    if (!formName) {
      throw Error(`Your form schema must have a formName property.`);
    }
    if (!validator.isAlphanumeric(formName)) {
      throw Error(`The formName property in your form schema may only contain alphanumeric characters.`);
    }
    return formName;
  }),

  formMetaData: computed('formObject', 'formName', function() {
    var storedformObject = this.get(`storageService.${this.get('formName')}`);
    if (storedformObject) {
      return storedformObject.formMetaData;
    } else {
      return this.get('formObject.formMetaData');
    }
  }),

  formFields: computed('formObject', 'formName', function() {
    var storedformObject = this.get(`storageService.${this.get('formName')}`);
    if (storedformObject) {
      return storedformObject.formFields;
    } else {
      return this.get('formObject.formFields');
    }
  }),

  submitButtonText: computed('formMetaData', function() {
    return this.get('formMetaData.submitButtonText') ? this.get('formMetaData.submitButtonText') : "Submit";
  }),

  resetButtonText: computed('formMetaData', function() {
    return this.get('formMetaData.resetButtonText') ? this.get('formMetaData.resetButtonText') : "Reset";
  }),

  validationFailed: computed('formMetaData.formStatus', function() {
    return this.get('formMetaData.formStatus') === 'validationFailed';
  }),

  willDestroyElement: function() {
    var formMetaTitle = this.get('formMetaData.formName');
    var storageService = this.get("storageService");
    if (!storageService) {return;}
    var form = this.get("formObject");
    storageService.set(formMetaTitle, form);
  },

  actions: {
    customValidations: function(formField) {
      this.customValidations(formField, this.get('formFields'));
    },

    setFormFieldValue: function(formField, value) {
      value = value || '';
      formField.set('value', value);
      if (this.customTransforms) {
        this.customTransforms(this.get('formFields'), fieldId, this.get('formMetaData'));
      }
    },

    setFormFieldError: function(formField, error) {
      formField.set('error', error);
    },

    submit: function() {
      var self = this;
      this.send('validateAllFields');
      if (this.formValidates()) {
        this.formValidationPassed();
        var formSchema = this.get('formSchema');
        var formFields = this.get('formFields');
        var formMetaData = this.get('formMetaData');
        var values = this.generateFormValues(formFields);
        this.set("requestInFlight", true);
        if (this.get('formMetaData.recordToUpdate')) {
          var record = this.get('formMetaData.recordToUpdate');
          formFields.forEach(function(formField) {
            if (formField.fieldId) {
              if (record.get(formField.fieldId)) {
                record.set(formField.fieldId, formField.value);
              }
            }
          });
          this.submitAction(record).then((response) => {
            self.saveSuccess(response, formFields, formMetaData);
            self.set("requestInFlight", false);
            if (formMetaData.resetAfterSubmit === true) {
              self.resetForm(formSchema);
            }
          }).catch(error => {
            self.set("requestInFlight", false);
            //TODO test that this actually works.
            record.rollbackAttributes();
            self.saveFail(error, formFields);
          });
        } else {

          this.submitAction(values, formMetaData.modelName).then((response) => {
            self.saveSuccess(response, formFields, formMetaData);
            self.set("requestInFlight", false);
            if (formMetaData.resetAfterSubmit === true) {
              this.send('resetForm');
            }
          }).catch(error => {
            self.set("requestInFlight", false);
            self.saveFail(error, formFields);
          });
        }
      } else {
        this.set('formMetaData.formStatus', 'validationFailed');
        this.set('formMetaData.submitButtonFeedback', 'Some fields have errors which must be fixed before continuing.');
        this.formValidationFailed(this.get('formFields'), this.get('formMetaData'));
      }
    },

    validateAllFields: function() {
      var self = this;
      var formFields = this.get('formFields');
      formFields.forEach(function(formField) {
        if (!formField.get('validationRules')) { return; }
        formField.set('error', validateField(formField));
        if (formField.get('error')) {
          return;
        }
        if (self.customValidations) {
          self.customValidations(formField, self.get('formFields'));
        }
      });
    },

    resetForm() {
      window.scrollTo(0, 0);
      this.set('formObject', generateEmberValidatingFormFields(this.get('formSchema')));
    },


  },

  formValidates: function() {
    var validationFields = this.get("formFields").rejectBy("validationRules", undefined).rejectBy("validationRules", null);
    if (validationFields.isEvery("error", false)) {
      return true;
    }
    return false;
  },

  generateFormValues: function(formFields) {
    var values = {};
    formFields.forEach(function(field) {
      if (!field.fieldId) {return;}
      var levels = field.fieldId.split(".");
      var acc = values;
      levels.forEach(function(level, index) {
        if (index === levels.length-1) {
          acc[level] = field.value;
        } else {
          acc[level] = acc[level] || {};
          acc = acc[level];
        }
      });
    });
    return values;
  },

  generateValidationErrorMessage: function(validationRule) {
    // Todo remove
    var readablevalidationRule = validationRule.substring(2).replace(/([A-Z])/g, function(match) {
       return "" + match;
    });
    if (readablevalidationRule !== readablevalidationRule.toUpperCase()) {
      readablevalidationRule = readablevalidationRule.toLowerCase();
    }
    return readablevalidationRule;
  },
});
