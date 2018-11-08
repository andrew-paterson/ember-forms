import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    var labelElement = this.$('label[for]');
    var forAttr = labelElement.attr('for');
    $(labelElement).click(function(e) {
      self.$(`#${forAttr}`).focus();
    });
  },
});