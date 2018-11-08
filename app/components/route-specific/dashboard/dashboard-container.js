import Component from '@ember/component';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  systemMessages: service(),
  tagName: '',

  init: function() {
    this._super(...arguments);
    this.customFieldSchema = {
      fieldId: 'test',
      fieldLabel: 'Name',
      fieldType: 'input',
      // validationRules: [{'validationMethod': 'isEmail'}, {'validationMethod': 'custom'}],
      validationRules: [{'validationMethod': 'custom'}],
      validationEvents: ['focusOut', 'keyUp'],
      inputType: 'email',
    }
  },

  actions: {
    checkAllowNext: function(formField) {
      if (formField.get('error') === false) {
        this.set('allowNext', true);
      } else {
        this.set('allowNext', false);
      }
    },

    customValidations: function(formField, formFields) {
      if (formField.get('fieldId') === 'test') {
        if (formField.value.indexOf('dassie') > -1) {
          formField.set('error', false);
        } else {
          formField.set('error', 'Must be a dassie.');
        }
      }
      this.send('checkAllowNext', formField);
    }
  }
});