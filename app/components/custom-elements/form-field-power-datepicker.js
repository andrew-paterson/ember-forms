import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  navButtons: computed('center', function() {
    var allowNavigationOutOfRange = this.get('formField.allowNavigationOutOfRange');
    return {
      nextMonth: allowNavigationOutOfRange || this.targetInRange(1, 'months'),
      nextYear: allowNavigationOutOfRange || this.targetInRange(1, 'years'),
      previousMonth: allowNavigationOutOfRange || this.targetInRange(-1, 'months'),
      previousYear: allowNavigationOutOfRange || this.targetInRange(-1, 'years'),
    }
  }),

  actions: {
    onTriggerFocus: function(datepicker) {
      datepicker.actions.open();
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
      this.set('center', startDate);
    },

    navigate: function(datepicker, span, units) {
      if (this.get('formField.allowNavigationOutOfRange') || this.targetInRange(span, units)) {
        datepicker.actions.moveCenter(span, units);
      }
    },

    selectDay: function(datepicker, span, units) {
      var formField = this.get('formField');
      var startOfVisibleMonth = moment(this.get('center')).startOf('month').toDate();
      var endOfVisibleMonth = moment(this.get('center')).endOf('month').toDate();
      var currentSelected = moment(this.get('selected'));
      var targetDay;

      if (this.get('selected') >= startOfVisibleMonth && this.get('selected') <= endOfVisibleMonth) {
        targetDay = currentSelected.add(span, units);
      } else {
        targetDay = startOfVisibleMonth;
      }
      if (targetDay > formField.get('maxDate')) {
        targetDay = formField.get('maxDate');
      }
      if (targetDay < formField.get('minDate')) {
        targetDay = formField.get('minDate');
      }

      this.set('selected', targetDay);
      this.set('center', this.get('selected'));
    },

    onTriggerKeydown(datepicker, e) {
      if (e.keyCode === 13) {
        this.send('setDate', this.get('selected'));
        e.preventDefault();
      }
      if (e.keyCode === 39) {
        if (e.shiftKey) {
          if (e.metaKey) {
            this.send('navigate', datepicker, 1, 'years');
          } else {
            this.send('navigate', datepicker, 1, 'months');
          }
        } else {
          this.send('selectDay', datepicker, 1, 'days');
        }
        e.preventDefault();
      }
      if (e.keyCode === 37) {
        if (e.shiftKey) {
          if (e.metaKey) {
            this.send('navigate', datepicker, -1, 'years');
          } else {
            this.send('navigate', datepicker, -1, 'months');
          }
        } else {
          this.send('selectDay', datepicker, -1, 'days');
        }
        e.preventDefault();
      }
      if (e.keyCode === 40) {
        if (!datepicker.isOpen) {
          datepicker.actions.open();
        } else {
          this.send('selectDay', datepicker, 7, 'days');

        }
        e.preventDefault();
      }
      if (e.keyCode === 38) {
        if (!datepicker.isOpen) {
          datepicker.actions.open();
        } else {
          this.send('selectDay', datepicker, -7, 'days');

        }
        e.preventDefault();
      }
    },

    setDate: function(date) {
      this.onUserInteraction(date);
      this.set('selected', date);
    },
  },

  targetInRange: function(span, units) {
    var formField = this.get('formField');
    var firstOfTargetMonth = moment(this.get('center')).add(span, units).startOf('month').toDate();
    var lastOfTargetMonth = moment(this.get('center')).add(span, units).endOf('month').toDate();
    if (firstOfTargetMonth > formField.get('maxDate') || lastOfTargetMonth < formField.get('minDate')) {
      return false;
    }
    return true;
  },
});
