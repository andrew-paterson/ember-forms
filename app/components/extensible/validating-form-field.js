import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';

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
      this.send("setError");
      if (this.get("autofocus") && !this.get("value")) {
        this.$("input").focus();
      }
      if (this.validateField && (this.get("validateOnInsert") || this.get('default'))) {
        this.validateField(this.get("fieldId"), this.get("value"));
      }
    });
  },

  observeErrorChange: observer('error', function() {
    this.send("setError");
  }),

  actions: {
    onFocusOut: function() {
      if (this.get("value") && this.get("trim")) {
        this.set("value", this.get("value").trim());
      }
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(this.get("fieldId"), this.get('value'));
      }
    },

    onFocusIn: function() {
      this.set("error", null);
      if (this.get("value") === null || this.get("value") === undefined) {
        this.set('value', '');
      }
      if (this.focusInAction) {
        this.focusInAction(this.get("fieldId"), this.get("value"));
      }
    },

    onKeyUp: function() {
      if (this.keyUpAction) {
        this.keyUpAction(this.get("fieldId"), this.get("value"));
      }
    },

    onRadioCheckboxClick: function(value, propertyName) {
      if (this.fieldUpdatedAction) {
        this.fieldUpdatedAction(value, propertyName, this.get("fieldId"));
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
  }
});
