import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  center: computed('selected', function() {
    return this.get('selected');
  }),
  actions: {
    openDropdown: function(dropdown) {
      dropdown.actions.open();
      var startDate = moment().toDate()
      var formField = this.get('formField');
      if (formField.get('maxDate') < moment().toDate()) {
        startDate = formField.get('maxDate');
      }
      if (formField.get('minDate') > moment().toDate() ||
      formField.get('minDate') < moment().toDate() && formField.get('maxDate') < moment().toDate() ||
      formField.get('minDate') > moment().toDate() && formField.get('maxDate') > moment().toDate()) {
        startDate = formField.get('minDate');
      }
      if (!this.get('selected')) {
        this.set('selected', startDate);
      }
    },

    onTriggerKeydown(dropdown, e) {
      if (e.keyCode === 13) {
        this.send('setDate', this.get('selected'));
        e.preventDefault();
      }
      if (e.keyCode === 39) {
        if (e.shiftKey) {
          if (e.metaKey) {
            this.send('nextYear');
          }
          this.send('nextMonth');
        } else {
          this.send('nextDay');
        }
        e.preventDefault();
      }
      if (e.keyCode === 37) {
        if (e.shiftKey) {
          if (e.metaKey) {
            this.send('previousYear');
          }
          this.send('previousMonth');
        } else {
          this.send('previousDay');
        }
        e.preventDefault();
      }
      if (e.keyCode === 40) {
        if (!dropdown.isOpen) {
          dropdown.actions.open();
        } else {
          this.send('nextWeek');
        }
        e.preventDefault();
      }
      if (e.keyCode === 38) {
        if (!dropdown.isOpen) {
          dropdown.actions.open();
        } else {
          this.send('previousWeek');
        }
        e.preventDefault();
      }
    },

    nextDay: function() {
      var formField = this.get('formField');
      var nextDay = moment(this.get('selected')).add(1, 'days');
      if (nextDay > formField.get('maxDate')) {
        return;
      }
      this.set('selected', nextDay);
    },

    previousDay: function() {
      var formField = this.get('formField');
      var previousDay = moment(this.get('selected')).subtract(1, 'days');
      if (previousDay < formField.get('minDate')) {
        return;
      }
      this.set('selected', previousDay);
    },

    nextWeek: function() {
      var formField = this.get('formField');
      var nextWeek = moment(this.get('selected')).add(7, 'days');
      if (nextWeek > formField.get('maxDate')) {
        return;
      }
      this.set('selected', nextWeek);
    },

    previousWeek: function() {
      var formField = this.get('formField');
      var previousWeek = moment(this.get('selected')).subtract(7, 'days');
      if (previousWeek < formField.get('minDate')) {
        return;
      }
      this.set('selected', previousWeek);
    },

    nextMonth: function() {
      var formField = this.get('formField');
      var nextMonth = moment(this.get('selected')).add(1, 'months');
      if (nextMonth > formField.get('maxDate')) {
        return;
      }
      this.set('selected', nextMonth);
    },

    previousMonth: function() {
      var formField = this.get('formField');
      var previousMonth = moment(this.get('selected')).subtract(1, 'months');
      if (previousMonth < formField.get('minDate')) {
        return;
      }
      this.set('selected', previousMonth);
    },

    nextYear: function() {
      var formField = this.get('formField');
      var nextYear = moment(this.get('selected')).add(1, 'years');
      if (nextYear > formField.get('maxDate')) {
        return;
      }
      this.set('selected', nextYear);
    },

    previousYear: function() {
      var formField = this.get('formField');
      var previousYear = moment(this.get('selected')).subtract(1, 'years');
      if (previousYear < formField.get('minDate')) {
        return;
      }
      this.set('selected', previousYear);
    },

    setDate: function(date) {
      this.onUserInteraction(date);
      this.set('selected', date);
    },
  },
});
