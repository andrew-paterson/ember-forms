import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['radio-button-group'],

  groupValue: computed('formField.value', function() {
    return this.get('formField.value');
  }),
});
