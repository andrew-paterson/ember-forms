import Component from '@ember/component';
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';

export default Component.extend({
  classNames: ['ember-power-datetime-picker'],
  attributeBindings: ['dataTestType:data-test-type', 'data-test-id'],

  dataTestType: "power-datetime-picker",

  init: function() {
    this._super(...arguments);
    this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    this.minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
  },

  didInsertElement: function() {
    if (this.get('defaultDate')) {
      this.set('selectedDate', this.get('defaultDate'));
    }
    if (this.get('defaultTime')) {
      this.set('selectedHour', this.get('defaultTime').split(':')[0]);
      this.set('selectedMinute', this.get('defaultTime').split(':')[1]);
    }
      if (this.get('calendarStartMonth')) {
        var split = this.get('calendarStartMonth').split('/');
        this.set('calendarStartDate', moment().year(parseInt(split[1])).month(parseInt(split[0])-1).day(1));
      }
  },

  updateDateTime: observer('selectedDate', 'selectedHour', 'selectedMinute', function() {
    once(this, function() {
      var selectedDate = this.get('selectedDate');
      if (!selectedDate) { return; }
      var day = moment(selectedDate).date();
      var month = moment(selectedDate).month();
      var year = moment(selectedDate).year();
      var hour = this.get('selectedHour') || 0;
      var minute = this.get('selectedMinute') || 0;
      var date = moment().year(year).month(month).date(day).hour(hour).minute(minute).second(0).toDate();
      this.onSelectDateTime(date);
    });
  }),

  navButtons: computed('center', function() {
    var allowNavigationOutOfRange = this.get('allowNavigationOutOfRange');
    return {
      nextMonth: allowNavigationOutOfRange || this.targetInRange(1, 'months'),
      nextYear: allowNavigationOutOfRange || this.targetInRange(1, 'years'),
      previousMonth: allowNavigationOutOfRange || this.targetInRange(-1, 'months'),
      previousYear: allowNavigationOutOfRange || this.targetInRange(-1, 'years'),
    }
  }),

  dateDisplayFormat: computed('dateFormat', function() {
    return this.get('dateFormat') || 'DD-MM-YYYY'; // TODO this must be a global option
  }),

  actions: {
    clearDateTime: function() {
      console.log('clearDateTime');
      this.onSelectDateTime(null);
    },

    setDate: function(selectedDate) {
      this.set('selectedDate', selectedDate);
    },

    setTime: function(unit, value) {
      this.set(unit, value);
    },

    onTriggerFocus: function(datepicker) {
      console.log('triggerFocus');
      datepicker.actions.open();
      var startDate = this.get('calendarStartDate') || moment().toDate()
      if (this.get('maxDate') < moment().toDate()) {
        startDate = this.get('maxDate');
      }
      if (this.get('minDate') > moment().toDate() ||
      this.get('minDate') < moment().toDate() && this.get('maxDate') < moment().toDate() ||
      this.get('minDate') > moment().toDate() && this.get('maxDate') > moment().toDate()) {
        startDate = this.get('minDate');
      }
      this.set('center', startDate);
    },

    navigate: function(datepicker, span, units) {
      if (this.get('allowNavigationOutOfRange') || this.targetInRange(span, units)) {
        datepicker.actions.moveCenter(span, units);
      }
    },

    selectDay: function(datepicker, span, units) {
      var targetDay;
      var startOfVisibleMonth = moment(this.get('center')).startOf('month').toDate();
      var endOfVisibleMonth = moment(this.get('center')).endOf('month').toDate();
      var currentSelected = moment(this.get('selected'));
      if (this.get('selected') >= startOfVisibleMonth && this.get('selected') <= endOfVisibleMonth) {
        targetDay = currentSelected.add(span, units);
      } else {
        targetDay = startOfVisibleMonth;
      }
      if (targetDay > this.get('maxDate')) {
        targetDay = this.get('maxDate');
      }
      if (targetDay < this.get('minDate')) {
        targetDay = this.get('minDate');
      }
      this.set('selected', targetDay);
      this.set('center', this.get('selected'));
    },

    onTriggerKeydown(datepicker, e) {
      console.log(e);
      if (e.keyCode === 13) {
        this.send('setDate', this.get('selected'));
        e.preventDefault();
      }
      if (e.keyCode === 39) {
        if (e.metaKey) {
          if (e.shiftKey) {
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
        if (e.metaKey) {
          if (e.shiftKey) {
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
  },

  targetInRange: function(span, units) {
    var firstOfTargetMonth = moment(this.get('center')).add(span, units).startOf('month').toDate();
    var lastOfTargetMonth = moment(this.get('center')).add(span, units).endOf('month').toDate();
    if (firstOfTargetMonth > this.get('maxDate') || lastOfTargetMonth < this.get('minDate')) {
      return false;
    }
    return true;
  },
});
