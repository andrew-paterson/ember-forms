import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  systemMessages: service(),
  actions: {
    setProperty: function(property, value) {
      this.set(property, value);
    },

    toggleProperty: function(property) {
      this.toggleProperty(property);
    },

    setSortParams: function(sortField, sortDirection) {
      if (sortField === this.get('sort_field')) {
        sortDirection = this.get('sort_direction') === 'desc' ? 'asc' : 'desc'
      }
      this.set('sort_field', sortField);
      this.set('sort_direction', sortDirection);
    },
  }
});
