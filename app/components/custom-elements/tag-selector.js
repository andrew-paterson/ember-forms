import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['tag-selector'],
  actions: {
    handleKeydown(dropdown, e) {
      if (e.keyCode !== 13 || !this.onPressEnter) { return; }
      this.onPressEnter(e.target.value, dropdown);
    }
  }
});
