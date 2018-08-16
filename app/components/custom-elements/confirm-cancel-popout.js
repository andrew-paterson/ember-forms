import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['confirm-cancel-container'],
  classNameBindings: ['containerClasses', 'colorScheme'],

  actions: {
    closePopoutBox: function(dropdown) {
      dropdown.actions.close();
    },

    confirm: function(dropdown) {
      if (this.confirmAction() === 'confirmActionFail') {
        return;
      }
      this.send('closePopoutBox', dropdown);
    },
  }
});