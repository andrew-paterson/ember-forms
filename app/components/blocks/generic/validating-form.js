// TODO arguments sent with submitAction change depending on whether the forms creates a new record or updates an existing one. This is differentiated by whether or not the "recordToUpdate" property is set, in which case it sends the updated model record.
import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import Object from '@ember/object';
import generateEmberValidatingFormFields from 'ember-starter/utils/generate-ember-validating-form-fields';

export default Component.extend({
  classNameBindings: ['class'],

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

  willDestroyElement: function() {
    var formMetaTitle = this.get('formMetaData.formName');
    var storageService = this.get("storageService");
    if (!storageService) {return;}
    var form = this.get("formObject");
    storageService.set(formMetaTitle, form);
  },

  actions: {
    setFormValue: function(fieldId, value) {
      value = value || '';
      var fieldObject = this.get('formFields').findBy('fieldId', fieldId);
      fieldObject.set('value', value);
      if (this.customTransforms) {
        this.customTransforms(this.get('formFields'), fieldId, this.get('formMetaData'));
      }
      if (!fieldObject.validationRules) {return;}
      this.send('validateField', fieldId);
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
        if (this.get('recordToUpdate')) {
          var record = this.get('recordToUpdate');
          formFields.forEach(function(formField) {
            if (formField.propertyName) {
              record.set(formField.propertyName, formField.value);
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
              self.resetForm(formSchema);
            }
          }).catch(error => {
            self.set("requestInFlight", false);
            self.saveFail(error, formFields);
          });
        }
      } else {
        this.formValidationFailed();
      }
    },

    validateAllFields: function() {
      var self = this;
      this.get('formFields').forEach(function(fieldObject) {
        self.send('setFormValue', fieldObject.fieldId, fieldObject.value);
      });
    },

    validateField: function(fieldId) {
      var self = this;
      var fieldObject = this.get('formFields').findBy('fieldId', fieldId);
      console.log(fieldObject.value);
      if (fieldObject.value === null || fieldObject.value === undefined) {
        return;
      }
      var stringValue = fieldObject.value.toString();
      var validationRules = fieldObject.validationRules || [];
      fieldObject.set("error", null);
      validationRules.forEach(function(validationRule) {
        var validationMethod = validationRule.validationMethod;
        var validationArgs = validationRule.arguments;
        var customErrorMessage = validationRule.errorMessage;
        validationMethod = validationMethod === "isDate" ? "toDate" : validationMethod;
        if (fieldObject.get("error")) {return;}
        // Validate required fields.
        var errorMessage;
        if (validationMethod === "required") {
          if (validator.isEmpty(stringValue)) {
            errorMessage = customErrorMessage || "This field is required.";
            fieldObject.set("error", errorMessage);
          } else {
            fieldObject.set("error", false);
          }
        // Validate all other types of fields
        } else if (validator[validationMethod]) {
          if (!validator[validationMethod](stringValue, validationArgs)) {
            errorMessage = customErrorMessage || `This is not a valid ${self.generateValidationErrorMessage(validationMethod)} value. Please try again.`;
            fieldObject.set("error", errorMessage);
          } else {
            fieldObject.set("error", false);
          }
        } else if (validationMethod === "custom") {
          if (self.customValidations)
            self.customValidations(fieldObject, self.get('formFields'));
          }
      });
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
      if (!field.propertyName) {return;}
      var levels = field.propertyName.split(".");
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
    var readablevalidationRule = validationRule.substring(2).replace(/([A-Z])/g, function(match) {
       return "" + match;
    });
    if (readablevalidationRule !== readablevalidationRule.toUpperCase()) {
      readablevalidationRule = readablevalidationRule.toLowerCase();
    }
    return readablevalidationRule;
  },
});
