import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import validateField from 'ember-starter/utils/validate-field';
import generateEmberValidatingFormField from 'ember-starter/utils/generate-ember-validating-form-field';

export default Component.extend({
  classNames: ["form-field"],
  classNameBindings: ["formField.error:invalid", "valid:valid", "formField.required:required", "disabled:disabled", "readonly:readonly", "customClasses", 'hideSuccessValidation:hide-success-validation'],

  didInsertElement: function() {
    //Code below will maintain validation colours when component is re-rendered.
    once(this, function() {
      var formField = this.get('formField');
      var value = formField.value;
      if (this.get("autofocus") && !value) {
        this.$("input").focus();
      }
      if (formField.validationEvents) {
        if (formField.validationEvents.indexOf('insert') > -1) {
          var validateOnInsert = true;
        }
      }
      if (validateOnInsert && formField.default) {
        this.send('validateField');
      }
    });
  },

  valid: computed('formField.error', function() {
    if (this.get("formField.error")) {
      return false;
    }
    if (this.get("formField.error") === false) {
      if (!this.get("hideValidationSuccess")) {
        return true;
      }
    }
    if (this.get("formField.error") === null || this.get("formField.error") === undefined) {
      return false;
    }
  }),

  inputIcon: computed('formField.error', function() {
    var formField = this.get('formField');
    if (this.get("formField.error")) {
      return "svg/icon-alert";
      return;
    }
    if (this.get("formField.error") === false) {
      if (!this.get("hideValidationSuccess")) {
        return "svg/icon-tick";
      return;
      }
    }
    if (this.get("formField.error") === null || this.get("formField.error") === undefined) {
      if (formField.get("required")) {
        return "svg/icon-asterisk";
      } else {
        this.set("inputIcon", this.get("defaultInputIcon"));
      }
      return;
    }
    if (formField.get("required")) {
      return "svg/icon-asterisk";
    }
  }),

  sendValidateOnValueUpdate: observer('formField.value', function() {
    var formField = this.get('formField');
    formField.validationEvents = formField.validationEvents || [];
    // If a field validates on keyUp, son't show a validation error if the backspace all chars in the field.
    if (formField.validationEvents.indexOf('keyUp') > -1 && formField.focussed && formField.value === '') {
      formField.set("error", null);
      return;
    }
    if (!formField.focussed || formField.validationEvents.indexOf('keyUp') > -1) {
      this.send('validateField');
    }
  }),

  formField: computed('fieldSchema', 'processedFieldSchema', function() {
    if (this.get('processedFieldSchema')) {
      return this.get('processedFieldSchema');
    } else {
      return generateEmberValidatingFormField(this.get('fieldSchema'));
    }
  }),

  actions: {
    onFocusOut: function(value) {
      var formField = this.get('formField');
      formField.set('focussed', false);
      this.send('validateField');
      if (value && this.get("trim")) {
        value = value.trim();
      }
    },

    onFocusIn: function(value) {
      var formField = this.get('formField');
      formField.set('focussed', true);
      var fieldValidationEvents = formField.get('validationEvents') || [];
      if (fieldValidationEvents.indexOf('keyUp') < 0) {
        formField.set('error', null);
      }
      if (this.focusInAction) {
        this.focusInAction(formField.get('fieldId'), value);
      }
    },

    onKeyUp: function(value) {
      this.send('setFieldValue', value);
      var formField = this.get('formField');
      if (this.keyUpAction) {
        this.keyUpAction(formField.get('fieldId'), value);
      }
    },

    onDateChange: function(value) {
      this.send('setFieldValue', value);
    },

    onRadioCheckboxClick: function(value) {
      this.send('setFieldValue', value);
    },

    onCheckboxClick: function(value) {
      this.send('setFieldValue', value);
    },

    onSelectClick: function(value) {
      this.send('setFieldValue', value);
    },

    validateField: function() {
      // Todo error must be updated by sending updateForm action if it is supplied.
      var self = this;
      once(this, function() {
        var formField = this.get('formField');
        this.send('setFieldError', null); // To ensure the error message updates, if the field has been updated but now fails a different validation rule to the previous validation attempt.
        var error = validateField(formField);
        this.send('setFieldError', error);
        if (error) { return; }
        // TODO throw error if custom is passed as a validation rule, but the 'customValidations' action is not passed in. Do this on didInsert.
        if (this.customValidations && formField.get('validationRules').findBy('validationMethod', 'custom')) {
          this.customValidations(formField, this.get('formFields'));
        }
      });
    },

    setFieldValue: function(value) {
      var formField = this.get('formField');
      if (this.setFormFieldValue) {
        this.setFormFieldValue(formField.get('fieldId'), value);
      } else {
        value = value || '';
        var formField = this.get('formField');
        formField.set('value', value);
        if (this.customTransforms) {
          this.customTransforms(this.get('formFields'), fieldId, this.get('formMetaData'));
        }
      }
    },

    setFieldError: function(error) {
      var formField = this.get('formField');
      if (this.setFormFieldError) {
        this.setFormFieldError(formField.fieldId, error);
      } else {
        formField.set('error', error);
      }
    },

    customValidations: function() {

    },
  },
  // TODO this must be used to generate more specific error messages.
  // generateValidationErrorMessage: function(validationRule) {
  //   var readablevalidationRule = validationRule.substring(2).replace(/([A-Z])/g, function(match) {
  //      return "" + match;
  //   });
  //   if (readablevalidationRule !== readablevalidationRule.toUpperCase()) {
  //     readablevalidationRule = readablevalidationRule.toLowerCase();
  //   }
  //   return readablevalidationRule;
  // },
});
