import Component from '@ember/component';
import { computed } from '@ember/object';
import generateEmberValidatingFormField from 'ember-starter/utils/generate-ember-validating-form-field';

export default Component.extend({
  formField: computed('fieldSchema', 'processedFieldSchema', function() {
    if (this.get('processedFieldSchema')) {
      return this.get('processedFieldSchema');
    } else {
      return generateEmberValidatingFormField(this.get('fieldSchema'));
    }
  }),

  actions: {
    setFieldValue: function(fieldId, value) {
      if (this.setFormFieldValue) {
        this.setFormFieldValue(fieldId, value);
      } else {
        console.log('setFieldValue');
        value = value || '';
        var formField = this.get('formField');
        formField.set('value', value);
        if (this.customTransforms) {
          this.customTransforms(this.get('formFields'), fieldId, this.get('formMetaData'));
        }
        // if (!formField.validationRules) {return;}
      }
    },

    setFieldError: function(error) {
      var formField = this.get('formField');
      if (this.setFormFieldError) {
        this.setFormFieldError(formField.fieldId, error);
      } else {
        formField.set('error', error);
        // if (this.customTransforms) {
        //   this.customTransforms(this.get('formFields'), fieldId, this.get('formMetaData'));
        // }
        // if (!formField.validationRules) {return;}
      }
    },

    customValidations: function() {

    }
  }
});
