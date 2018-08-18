import Component from '@ember/component';
import EmberObject from '@ember/object';

export default Component.extend({
  tagName: '',
  actions: {
    createNewField: function() {
      this.set('showFieldCreator', true);
      if (!this.get('dynamicFormFields')) {
        this.set('dynamicFormFields', []);
      }
      var field = EmberObject.create({
        fieldId: this.randomNumber(),
        trim: true,
        value: null,
        showLabel: true,
        inputType: 'text',
      });
      this.get('dynamicFormFields').pushObject(field);
      this.set('currentField', field);
    },

    updateDynamicForm: function(field) {
      var existingField = this.get('dynamicFormFields').findBy('fieldId', field.fieldId);
      if (existingField) {
        existingField.set('label', field.label);
        existingField.set('options', field.options);
        existingField.set('fieldType', field.fieldType);
        existingField.set('propertyName', field.fieldLabel);
        existingField.set('options', field.fieldOptionsValuesArray);
        existingField.set('radioButtons', field.radioButtons);
        existingField.set('validationRules', field.fieldValidationRules);
      }
    }
  },

  randomNumber: function() {
    return Math.floor(Math.random() * (3000000 - 0 + 1)) + 0;
  },
});
