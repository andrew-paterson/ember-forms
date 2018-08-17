import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  actions: {
    updateDynamicForm: function(field) {
      console.log(field.options);
      if (!this.get('dynamicFormFields')) {
        this.set('dynamicFormFields', []);
      }
      var existingField = this.get('dynamicFormFields').findBy('fieldId', field.fieldId);
      if (existingField) {
        existingField.set('label', field.label);
        existingField.set('options', field.options);
        existingField.set('fieldType', field.fieldType);
      } else {
        this.get('dynamicFormFields').pushObject(field);
      }
    }
  }
});
