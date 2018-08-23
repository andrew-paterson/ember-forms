import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import validateField from 'ember-starter/utils/validate-field';

export default Component.extend({
  classNames: ["form-field"],
  classNameBindings: ["error:invalid", "valid:valid", "required:required", "disabled:disabled", "readonly:readonly", "validates:validates", "customClasses", 'hideSuccessValidation:hide-success-validation'],

  validates: computed("validationRules", function() {
    if (this.get("validationRules")) {
      return true;
    }
  }),

  required: computed("validationRules", function() {
    if (!this.get("validationRules")) {
      return false;
    }
    return this.get("validationRules").indexOf("required") > -1;
  }),

  didInsertElement: function() {
    //Code below will maintain validation colours when component is re-rendered.
    once(this, function() {
      var formField = this.get('formField');
      var value = formField.value;
      this.send("setError");
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

  observeErrorChange: observer('error', function() {
    this.send("setError");
  }),

  observeValidationOnChange: observer('validationOn', function() {
    this.send("validateField");
  }),

  actions: {
    onFocusOut: function(value) {
      var formField = this.get('formField');
      if (value && this.get("trim")) {
        formField.set("value", value.trim());
      }
      if (!this.get('validationOn')) {
        this.set('validationOn', true)
      } else {
        this.send('validateField');
      }
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(formField.get('fieldId'), value);
      }
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
      // if (this.keyUpAction) {
      //   this.keyUpAction(formField.get('fieldId'), value);
      // }
      if (formField.validationEvents) {
        if (formField.validationEvents.indexOf('keyUp') > 0) {
          this.send('validateField');
        }
      }
    },

    onRadioCheckboxClick: function(value, fiedId) {
      var formField = this.get('formField');
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(value, fieldId);
      }
    },

    setError: function() {
      if (this.get("error")) {
        this.set("valid", false);
        this.set("inputIcon", "svg/icon-alert");
        return;
      }
      if (this.get("error") === false) {
        if (!this.get("hideValidationSuccess")) {
          this.set("valid", true);
          this.set("inputIcon", "svg/icon-tick");
        return;
        }
      }
      if (this.get("error") === null || this.get("error") === undefined) {
        this.set("valid", false);
        if (this.get("required")) {
          this.set("inputIcon", "svg/icon-asterisk");
        } else {
          this.set("inputIcon", this.get("defaultInputIcon"));
        }
        return;
      }
      if (this.get("required")) {
        this.set("inputIcon", "svg/icon-asterisk");
      }
    },

    validateField: function() {
      // Todo error must be updated by sending updateForm action if it is supplied.
      once(this, function() {
        var formField = this.get('formField');
        formField.set('error', validateField(formField,  this.get('formFields')));
        if (this.get('formField.error')) {
          return;
        }
        if (this.customValidations) {
          this.customValidations(formField, this.get('formFields'));
        }
      });
    }
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
