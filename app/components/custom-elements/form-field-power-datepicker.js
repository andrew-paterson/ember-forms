import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  init: function() {
    this._super(...arguments);
    this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    this.minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
  },

  didInsertElement: function() {
    this.send('setTime');
  },

  navButtons: computed('center', function() {
    var allowNavigationOutOfRange = this.get('formField.allowNavigationOutOfRange');
    return {
      nextMonth: allowNavigationOutOfRange || this.targetInRange(1, 'months'),
      nextYear: allowNavigationOutOfRange || this.targetInRange(1, 'years'),
      previousMonth: allowNavigationOutOfRange || this.targetInRange(-1, 'months'),
      previousYear: allowNavigationOutOfRange || this.targetInRange(-1, 'years'),
    }
  }),

  dateFormat: computed('formField.dateFormat', function() {
    return this.get('formField.dateFormat') || 'DD-MM-YYYY'; // TODO this must be a global option
  }),

  actions: {
    setDate: function(date) {
      this.set('selected', date);
      this.onUserInteraction(this.get('selected'));
      this.send('setTime');
    },

    setTime: function(unit, value) {
      var formField = this.get('formField');
      var currentDate = this.get('selected');
      if (!(unit || value)) {
        var defaultTime = formField.get('defaultTime') || '00:00';
        var hour = defaultTime.split(':')[0];
        var minute = defaultTime.split(':')[1];
        this.set('selected', moment(currentDate).hour(parseInt(hour)).minute(parseInt(minute)));
      } else {
        if (unit === 'hour') {
          this.set('selected', moment(currentDate).hour(parseInt(value)));
        } else if (unit === 'minute') {
          this.set('selected', moment(currentDate).minute(parseInt(value)));
        }
      }
      this.onUserInteraction(this.get('selected'));
    },

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


    // minChanged(event) {
    //   console.log(event.target.value) // the slider's value
    //   this.set('minValue', event.target.value);
    // },
    // maxChanged(event) {
    //   console.log(event.target.value) // the slider's value
    //   this.set('maxValue', event.target.value);
    // }
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
