import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ["filter-box", "date-range"],
  classNameBindings: ["class"],

  startDateParsed: computed('startDateString', function() {
    if (this.get('startDateString')) {
      return new Date(this.get('startDateString'));
    }
  }),

  endDateParsed: computed('endDateString', function() {
    if (this.get('endDateString')) {
      return new Date(this.get('endDateString'));
    }
  }),

  actions: {
    parseDateValue: function(paramName, type) {
      var updatedValue = type === "start" ? moment(this.get('startDateParsed')).format('YYYY-MM-DD') : moment(this.get('endDateParsed')).format('YYYY-MM-DD');
      this.setProperty(paramName, updatedValue);
    },

  }
});