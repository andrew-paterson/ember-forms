import Component from '@ember/component';

export default Component.extend({
  classNames: ['checkbox-group'],
  didInsertElement: function() {
    var checkedItems = this.get('formField.value') || [];
    var options = this.get('formField.options');
    options.forEach(function(option) {
      if (checkedItems.indexOf(option.key) > -1) {
        option.set('value', true);
      } else {
        option.set('value', false);
      }
    })
  },

  actions: {
    checkboxToggled: function(key, value) {
      var checkedItems = this.get('formField.value') || [];
      if (value === true) {
        checkedItems.pushObject(key);
      } else {
        checkedItems.removeObject(key);
      }
      this.onUserInteraction(checkedItems);
    }
  }
});