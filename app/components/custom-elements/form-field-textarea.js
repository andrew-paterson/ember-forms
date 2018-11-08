import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    // Note do this so that you can get the event object. Ember's built in keyUp helper does not allow for this.
    this.element.addEventListener('keyup', (e) => this.send('handleKeyUp', e));
  },

  actions: {
    handleKeyUp(e) {
      this.onKeyUp(e.target.value, e);
    },
  }
});