import Component from '@ember/component';
export default Component.extend({
  tagName: 'span',
  classNames: ['toggle-button'],
  classNameBindings: ['classes', 'popoutBoxName:open:closed'],

  click() {
    this.toggleProperty('popoutBoxName');
  },
});
