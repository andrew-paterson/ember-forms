import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['radio-checkbox-wrapper'],
  classNameBindings: ['checked:checked:unchecked', 'disabled:disabled'],
});