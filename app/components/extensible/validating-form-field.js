import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import validateField from 'ember-starter/utils/validate-field';

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
        if (formField.validationEvents.indexOf('insert') > 0) {
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

  actions: {
    onDateChange: function(value) {
      var formField = this.get('formField');
      if (value && this.get("trim")) {
        formField.set("value", value.trim());
      }
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(formField.get('fieldId'), value);
      }
      // QUE should this be default for all focusOut?.
      this.send('validateField');
    },
    onFocusOut: function(value) {
      var formField = this.get('formField');
      if (value && this.get("trim")) {
        formField.set("value", value.trim());
      }
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(formField.get('fieldId'), value);
      }
      // QUE should this be default for all focusOut?.
      this.send('validateField');
    },

    onFocusIn: function(value) {
      var formField = this.get('formField');
      formField.set('error', null);
      if (this.focusInAction) {
        this.focusInAction(formField.get('fieldId'), value);
      }
    },

    onKeyUp: function(value) {
      var formField = this.get('formField');
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(formField.get('fieldId'), value);
      }
      if (this.keyUpAction) {
        this.keyUpAction(formField.get('fieldId'), value);
      }
      if (formField.validationEvents) {
        if (formField.validationEvents.indexOf('keyUp') > 0) {
          this.send('validateField');
        }
      }
    },

    onRadioCheckboxClick: function(value, fieldId) {
      var formField = this.get('formField');
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(value, fieldId);
      }
      this.send('validateField');
    },

    onCheckboxClick: function(fieldId, value) {
      var formField = this.get('formField');
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(value, fieldId);
      }
      this.send('validateField');
    },

    onSelectClick: function(value, fieldId) {
      var formField = this.get('formField');
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(value, fieldId);
      }
      this.send('validateField');
    },

    validateField: function() {
      // Todo error must be updated by sending updateForm action if it is supplied.
      once(this, function() {
        var formField = this.get('formField');
        formField.set("error", null); // To ensure the error message updates, if the field has been updated but now fails a different validation rule to the previous validation attempt.
        formField.set('error', validateField(formField));
        if (formField.get('error')) { return; }
        if (this.customValidations && formField.get('validationRules').findBy('validationMethod', 'custom')) {
          this.customValidations(formField, this.get('formFields'));
        }
      });
    }
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
