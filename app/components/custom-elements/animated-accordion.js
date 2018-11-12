import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'div',
  classNames: ['accordion-item'],
  classNameBindings: ['classes', 'open:open'],

  expandCollapseIcon: computed("open", function() {
    return this.get("open") ? "svg/icons/icon-arrow-up" : "svg/icons/icon-arrow-down";
  }),

  actions: {
    toggleAccordion: function() {
      this.toggleProperty("open");
    },
  }
});