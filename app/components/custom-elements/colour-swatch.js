import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  swatchBackgroundStyle: computed('swatchColour', function() {
    var colour = this.get('swatchColour');
    var style = `background: #${colour}`;
    var escapedStyle = style.htmlSafe();
    return escapedStyle;
  }),
});
