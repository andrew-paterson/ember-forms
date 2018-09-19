import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dateFormat: computed('formField.format', function() {
    if (!this.get('format')) {
      return  "dd-mm-yyyy";
    } else {
      return this.get('formField.format');
    }
  }),
});