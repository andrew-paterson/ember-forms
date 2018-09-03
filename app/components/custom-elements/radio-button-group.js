import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['radio-button-group'],
  groupValue: computed('value', function() {
    return this.get('value');
  }),
});
