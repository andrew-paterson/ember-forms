import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import EmberObject from '@ember/object';

export default Component.extend({
  init: function() {
    this._super(...arguments);
    this.fieldTypes = [
      {
        'label': 'Input',
        'value': 'input',
        'data-test-id': 'radio-option-input'
      }, {
        'label': 'Textarea',
        'value': 'textarea',
        'data-test-id': 'radio-option-textarea'
      }, {
        'label': 'Select',
        'value': 'select',
        'data-test-id': 'radio-option-select'
      }, {
        'label': 'Radio Buttons',
        'value': 'radioButtonGroup',
        'data-test-id': 'radio-option-radio_buttons'
      }, {
        'label': 'Date',
        'value': 'date',
        'data-test-id': 'radio-option-date'
      }, {
        'label': 'Single Checkbox',
        'value': 'singleCheckbox',
        'data-test-id': 'radio-option-checkbox_list'
      }
    ];
    this.fieldOptions = [];
  },

  didInsertElement: function() {
    this.send('addOption');
  },

  showOptionsField: computed('currentField.fieldType', function() {
    var fieldType = this.get('currentField.fieldType');
    if (fieldType === 'select' || fieldType === 'radioButtonGroup') {
      return true;
    }
  }),

  setFieldOptionsValuesArray: observer('currentField.fieldOptions', 'currentField.fieldOptions.@each.label', function() {
    var fieldOptionsValuesArray = [];
    this.get('currentField.fieldOptions').forEach(function(option) {
      if (option.label) {
        fieldOptionsValuesArray.push(option.label);
      }
    });
    this.set('currentField.fieldOptionsValuesArray', fieldOptionsValuesArray);
    this.send('saveField');
  }),

  actions: {
    saveField: function() {
      this.updateDynamicForm(this.get('currentField'));
    },

    validateField: function(fieldId, value) {
      if (value === null || value === undefined) {
        return;
      }

      this.set(`currentField.${fieldId}`, value);
      this.send('saveField');

      if (fieldId === 'label') {
        this.set('label', value);
        if (validator.isEmpty(value)) {
          this.set('fieldLabelError', 'You must provide a field label.');
          return false;
        } else if (!validator.isLength(value, {max: 100})) {
          this.set('fieldLabelError', 'Your field label cannot be longer than 100 characters.');
          return false;
        } else {
          this.set('fieldLabelError', false);
          return true;
        }
      }
      // fieldValidationRules
    },

    addOption: function() {
      var randomNumber = Math.floor(Math.random() * (3000000 - 0 + 1)) + 0;
      var newOption = EmberObject.create({
        id: randomNumber,
        label: null
      });
      this.get('currentField.fieldOptions').pushObject(newOption);
    },

    updateOption: function(optionId, value) {
      var thisOption = this.get('currentField.fieldOptions').findBy('id', optionId);
      thisOption.set('label', value);
      thisOption.set('value', value.replace(' ', '_'));
      this.send('saveField');
    },

    setType: function(groupValue, propertyName) {
        this.set(`currentField.${propertyName}`, groupValue);
      this.send('saveField');
    }
  },
});
