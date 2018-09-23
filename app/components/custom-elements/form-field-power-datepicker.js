import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  center: computed('selected', function() {
    return this.get('selected');
  }),
  actions: {
    openDropdown: function(dropdown) {
      if (!this.get('selected')) {
        this.set('selected', moment().toDate());
      }
      dropdown.actions.open();
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
      this.set('selected', moment(this.get('selected')).add(1, 'days'));
    },

    previousDay: function() {
      this.set('selected', moment(this.get('selected')).subtract(1, 'days'));
    },

    nextWeek: function() {
      this.set('selected', moment(this.get('selected')).add(7, 'days'));
    },

    previousWeek: function() {
      this.set('selected', moment(this.get('selected')).subtract(7, 'days'));
    },

    nextMonth: function() {
      this.set('selected', moment(this.get('selected')).add(1, 'months'));
    },

    previousMonth: function() {
      this.set('selected', moment(this.get('selected')).add(1, 'months'));
    },

    nextYear: function() {
      this.set('selected', moment(this.get('selected')).add(1, 'years'));
    },

    previousYear: function() {
      this.set('selected', moment(this.get('selected')).subtract(1, 'years'));
    },

    setDate: function(date) {
      this.onUserInteraction(date);
      this.set('selected', date);
    },
  },
});
