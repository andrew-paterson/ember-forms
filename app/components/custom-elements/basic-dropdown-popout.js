import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'div',

  positionClass: computed("positionStatic", function() {
    return this.get("positionStatic") ? "position-static" : "";
  }),

  actions: {
    closePopoutBox: function(dropdown) {
      dropdown.actions.close();
    },
  }
});