import Component from '@ember/component';
import { computed } from '@ember/object';
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

  showOptionsField: computed('fieldType', function() {
    var fieldType = this.get('fieldType');
    if (fieldType === 'select' || fieldType === 'radioButtonGroup') {
      return true;
    }
  }),

  fieldOptionsValuesArray: computed('fieldOptions', 'fieldOptions.@each.label', function() {
    var fieldOptionsValuesArray = this.get('fieldOptions').map(function(option) {
      return option.label;
    });
    return fieldOptionsValuesArray;
  }),

  fieldSchema: computed('fieldLabel', 'fieldType', 'fieldOptions', 'fieldOptions.@each.label', function() {fieldLabel
    var fieldJSON = EmberObject.create({
      fieldId: this.get('currentField.fieldId'),
      label: this.get('fieldLabel'),
      fieldType: this.get('fieldType'),
      options: this.get('fieldOptionsValuesArray'),
      radioButtons: this.get('fieldOptions'),
      validationRules: [{'validationMethod': 'required'}],
      inputType: 'text',

    });
    return fieldJSON;
  }),

  actions: {
    saveField: function() {
      var dynamicFormField = this.get('fieldSchema');
      this.updateDynamicForm(dynamicFormField);
    },

    validateField: function(fieldId, value) {
      if (value === null || value === undefined) {
        return;
      }

      var stringValue = value.toString();
      if (fieldId === 'fieldLabel') {
        this.set('fieldLabel', value);
        if (validator.isEmpty(value)) {
          this.set('fieldLabelError', 'You must provide a field name in order to continue.');
          return false;
        } else if (!validator.isLength(value, {max: 100})) {
          this.set('fieldLabelError', 'Your field name cannot be longer than 100 characters.');
          return false;
        } else {
          this.set('fieldLabelError', false);
          this.send('saveField');
          return true;
        }
      };
      // fieldValidationRules
    },

    addOption: function() {
      var randomNumber = Math.floor(Math.random() * (3000000 - 0 + 1)) + 0;
      var newOption = EmberObject.create({
        id: randomNumber,
        label: null
      });
      this.get('fieldOptions').pushObject(newOption);
    },

    updateOption: function(fieldId, value) {
      var thisOption = this.get('fieldOptions').findBy('id', fieldId);
      thisOption.set('label', value);
      thisOption.set('value', value.replace(' ', '_'));
    },

    setType: function(groupValue, propertyName) {
      this.set(propertyName, groupValue);
    }
  },
});
