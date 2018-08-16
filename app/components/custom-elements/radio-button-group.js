import ValidatingFormField from 'ember-starter/components/extensible/validating-form-field'
import { computed } from '@ember/object';

export default ValidatingFormField.extend({
  groupValue: computed('value', function() {
    return this.get('value');
  }),
});
