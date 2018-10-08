import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | custom-elements/power-datetime-picker', function(hooks) {
  setupRenderingTest(hooks);

  test('Basic rendering', async function(assert) {

    await render(hbs`{{custom-elements/power-datetime-picker}}`);

    assert.ok(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), 'Select date button displays by default.');
    assert.equal(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]').textContent.trim(), 'Select Date', 'The correct default text renders on the Select Date button');
    assert.notOk(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="time-selector"]'), 'Select time button does not display by default.');

    await render(hbs`{{custom-elements/power-datetime-picker timeSelect=true}} `);
    assert.ok(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="time-selector"]'), 'Select time button show when "selectTime" property is true.');
    assert.notEqual(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="time-selector"] button.time-select-placeholder').getAttribute('disabled'), null, 'Select time button is disabled if a date is not selected.');
    assert.equal(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="time-selector"]').textContent.trim(), 'Select Time', 'The correct default text renders on the Select Time button');

    await render(hbs`{{custom-elements/power-datetime-picker timeSelect=true dateButtonText='Test date' timeButtonText='Test time'}} `);
    assert.equal(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]').textContent.trim(), 'Test date', 'Custom text renders on the Select Date button when "dateButtonText" is set.');
    assert.equal(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="time-selector"]').textContent.trim(), 'Test time', 'Custom text renders on the Select Time button when "timeButtonText" is set.');

  });

  test('Default time and date', async function(assert) {
    var testDate = '2018-04-01';
    var testTime = '00:00';
    this.set('defaultDate', moment('2018-04-01').toString());
    this.set('dummyAction_onSelectDateTime', (dateTime) => {
      this.set('value', dateTime);
      assert.equal(dateTime.toString(), moment(`${testDate} ${testTime}`).toDate().toString(), '[---Action---] The date is correctly sent to the onSelectDateTime action when a date is clicked.');
    });

    await render(hbs`{{custom-elements/power-datetime-picker
      timeSelect=true
      onSelectDateTime=(action dummyAction_onSelectDateTime)
      defaultDate=defaultDate
      value=value
    }} `);
    var datePickerTriggerText = this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]').textContent.trim();
    assert.equal(datePickerTriggerText, '01-04-2018', 'Date defaults to "defaultDate" on insert, if the "defaultDate" property is passed.');
    assert.ok(datePickerTriggerText[2] === '-' && datePickerTriggerText[5] === '-', 'Date format defaults to "DD-MM-YYYY.'); // TODO must relate to a global option.

    assert.ok(
      this.element.querySelector('[data-test-type="time-selector"] #hours .ember-power-select-selected-item').textContent.trim() === '00' &&
      this.element.querySelector('[data-test-type="time-selector"] #minutes .ember-power-select-selected-item').textContent.trim() === '00',
      'Time defaults to "00:00" when date is selected.'
    );
    testTime = '23:59'
    await render(hbs`{{custom-elements/power-datetime-picker
      timeSelect=true
      onSelectDateTime=(action dummyAction_onSelectDateTime)
      defaultDate=defaultDate
      dateFormat='YYYY/MM/DD'
      defaultTime='23:59'
      value=value
    }} `);
    assert.ok(
      this.element.querySelector('[data-test-type="time-selector"] #hours .ember-power-select-selected-item').textContent.trim() === '23' &&
      this.element.querySelector('[data-test-type="time-selector"] #minutes .ember-power-select-selected-item').textContent.trim() === '59',
      'Time defaults to "defaultTime" when date is selected, if "defaultTime" property is passed.'
    );
    var datePickerTriggerText = this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]').textContent.trim();
    assert.ok(datePickerTriggerText[4] === '/' && datePickerTriggerText[7] === '/', 'Datepicker trigger displays date in the correct format when "dateFormat" is supplied.');
  });

  test('Date and time selection', async function(assert) {
    var testDate = '2018-04-01';
    var testTime = '00:00';
    this.set('dummyAction_onSelectDateTime', (dateTime) => {
      this.set('value', dateTime);
      assert.equal(dateTime.toString(), moment(`${testDate} ${testTime}`).toDate().toString(), '[---Action---] The date is correctly sent to the onSelectDateTime action when a date is clicked.');
    });
    this.set('calendarCenter', moment(`${testDate} ${testTime}`).toDate());
    await render(hbs`{{custom-elements/power-datetime-picker
      value=value
      calendarCenter=calendarCenter
      timeSelect=true
      onSelectDateTime=(action dummyAction_onSelectDateTime)
    }}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await click(`[data-date="${testDate}"]`);
    assert.equal(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]').textContent.trim(), '01-04-2018', 'The value property shows on the datepicker button when date is clicked.');
  });

  test('Calendar Navigation', async function(assert) {
    var today = moment().format('YYYY-MM-DD');
    var nextYear = moment().add(1, 'years').startOf('date');
    var nextYearFormatted = moment().add(1, 'years').format('YYYY-MM-DD');
    var nextYearMinusOne = moment().add(1, 'years').subtract(1, 'days').format('YYYY-MM-DD');
    var lastYear = moment().subtract(1, 'years').startOf('date');
    var lastYearFormatted = moment().subtract(1, 'years').format('YYYY-MM-DD');
    var lastYearPlusOne = moment().subtract(1, 'years').add(1, 'days').format('YYYY-MM-DD');
    this.set('nextYear', nextYear.toDate());
    this.set('lastYear', lastYear.toDate());

    await render(hbs`{{custom-elements/power-datetime-picker}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    assert.ok(document.querySelector(`[data-date="${today}"]`), 'By default, calendar view starts on the current month.');

    await render(hbs`{{custom-elements/power-datetime-picker minDate=nextYear}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    assert.ok(document.querySelector(`[data-date="${nextYearFormatted}"]`), 'If "minDate" is after today, the calendar starts on the month containing "minDate".')
    assert.ok(
      document.querySelector(`[data-date="${nextYearFormatted}"]`).getAttribute('disabled') === null &&
      document.querySelector(`[data-date="${nextYearMinusOne}"]`).getAttribute('disabled') !== null,
      'Days before "minDate" are disabled.'
    );

    await render(hbs`{{custom-elements/power-datetime-picker maxDate=lastYear}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));

    assert.ok(document.querySelector(`[data-date="${lastYearFormatted}"]`), 'If "maxDate" is before today, the calendar starts on the month containing "maxDate".')
    assert.ok(
      document.querySelector(`[data-date="${lastYearFormatted}"]`).getAttribute('disabled') === null &&
      document.querySelector(`[data-date="${lastYearPlusOne}"]`).getAttribute('disabled') !== null,
      'Days after "minDate" are disabled.'
    );
  });
});

// TODO when default date is out of minDate and maxDate range.
