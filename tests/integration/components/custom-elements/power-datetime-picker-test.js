import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
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
    this.set('defaultDate', moment(testDate).toString());
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
    this.set('calendarStartMonth', '04/2018');
    await render(hbs`{{custom-elements/power-datetime-picker
      value=value
      calendarStartMonth=calendarStartMonth
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

    this.set('calendarStartMonth', '10/2018');
    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await click(document.querySelector('[data-test-id="power-calendar-nav-next-month"]'));
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "November 2018", 'Click navigation to next month works.');
    await click(document.querySelector('[data-test-id="power-calendar-nav-next-year"]'));
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "November 2019", 'Click navigation to next year works.');
    await click(document.querySelector('[data-test-id="power-calendar-nav-previous-month"]'));
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "October 2019", 'Click navigation to previous month works.');
    await click(document.querySelector('[data-test-id="power-calendar-nav-previous-year"]'));
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "October 2018", 'Click navigation to previous year works.');

    this.set('calendarStartMonth', '10/2018');
    this.set('minDate', moment('2017-09-30').toDate());
    this.set('maxDate', moment('2019-11-30').toDate());
    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth minDate=minDate maxDate=maxDate}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await click(document.querySelector('[data-test-id="power-calendar-nav-next-year"]'));
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-next-year"]').getAttribute('disabled') !== null, 'Next year button is disabled when next year is out of range.');
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-next-year"]').classList.contains('disabled'), 'Next year button has disabled class when next year is out of range.');
    await click(document.querySelector('[data-test-id="power-calendar-nav-next-month"]'));
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-next-month"]').getAttribute('disabled') !== null, 'Next month button is disabled when next month is out of range.');
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-next-month"]').classList.contains('disabled') !== null, 'Next month button has disabled class when next month is out of range.');

    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth minDate=minDate maxDate=maxDate}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await click(document.querySelector('[data-test-id="power-calendar-nav-previous-year"]'));
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-previous-year"]').getAttribute('disabled') !== null, 'Previous year button is disabled when previous year is out of range.');
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-previous-year"]').classList.contains('disabled') !== null, 'Previous year button has disabled class when previous year is out of range.');
    await click(document.querySelector('[data-test-id="power-calendar-nav-previous-month"]'));
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-previous-month"]').getAttribute('disabled') !== null, 'Previous month button is disabled when previous month is out of range.');
    assert.ok(document.querySelector('[data-test-id="power-calendar-nav-previous-month"]').classList.contains('disabled') !== null, 'Previous month button has disabled class when previous month is out of range.');
  });

  test('Keyboard Accessibility', async function(assert) {
    this.set('calendarStartMonth', '10/2018');
    this.set('minDate', moment('2017-09-30').toDate());
    this.set('maxDate', moment('2019-11-30').toDate());
    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight');
    assert.ok(document.querySelector('[data-date="2018-10-01"]').classList.contains('ember-power-calendar-day--selected'), "Right arrow selects first day of month when none are selected.");

    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowDown');
    assert.ok(document.querySelector('[data-date="2018-10-01"]').classList.contains('ember-power-calendar-day--selected'), "Down arrow selects first day of month when none are selected.");

    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft');
    assert.ok(document.querySelector('[data-date="2018-10-01"]').classList.contains('ember-power-calendar-day--selected'), "Left arrow selects first day of month when none are selected.");

    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowUp');
    assert.ok(document.querySelector('[data-date="2018-10-01"]').classList.contains('ember-power-calendar-day--selected'), "Up arrow selects first day of month when none are selected.");

    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight');
    assert.ok(document.querySelector('[data-date="2018-10-02"]').classList.contains('ember-power-calendar-day--selected'), "Right arrow selects next day of month.");
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft');
    assert.ok(document.querySelector('[data-date="2018-10-01"]').classList.contains('ember-power-calendar-day--selected'), "Left arrow selects previous day of month.");

    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowDown');
    assert.ok(document.querySelector('[data-date="2018-10-08"]').classList.contains('ember-power-calendar-day--selected'), "Down arrow selects same day in next week.");
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowUp');
    assert.ok(document.querySelector('[data-date="2018-10-01"]').classList.contains('ember-power-calendar-day--selected'), "Up arrow selects same day in previous week.");
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowUp');
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "September 2018", 'Arrow key moves calendar to new month if necessary.');

    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight', {metaKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "October 2018", 'Meta + ArrowRight moves calendar to next month.');
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft', {metaKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "September 2018", 'Meta + ArrowLeft moves calendar to previous month.');
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight', {metaKey: true, shiftKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "September 2019", 'Meta + Shift + ArrowRight moves calendar to next year.');
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft', {metaKey: true, shiftKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "September 2018", 'Meta + Shift + ArrowLeft moves calendar to previous year.');

    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth  minDate=minDate maxDate=maxDate}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight', {metaKey: true, shiftKey: true});
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight', {metaKey: true, shiftKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "October 2019", 'Meta + Shift + ArrowRight does not move calendar to next year if it is out of range.');

    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth  minDate=minDate maxDate=maxDate}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft', {metaKey: true, shiftKey: true});
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft', {metaKey: true, shiftKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "October 2017", 'Meta + Shift + ArrowLeft does not move calendar to previous year if it is out of range.');

    this.set('minDate', moment('2018-09-01').toDate());
    this.set('maxDate', moment('2018-11-30').toDate());
    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth  minDate=minDate maxDate=maxDate}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight', {metaKey: true});
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight', {metaKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "November 2018", 'Meta + ArrowRight does not move calendar to next month if it is out of range.');

    this.set('dummyAction_onSelectDateTime', (dateTime) => {
      this.set('value', dateTime);
      assert.ok(moment(dateTime).isValid(), '[---Action---] A valid date is sent to the onSelectDateTimeAction when a date is selected and Enter is pressed.');
      return this.pauseTest();
    });
    await render(hbs`{{custom-elements/power-datetime-picker calendarStartMonth=calendarStartMonth minDate=minDate maxDate=maxDate  onSelectDateTime=(action dummyAction_onSelectDateTime)}}`);
    await click(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'));
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft', {metaKey: true});
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowLeft', {metaKey: true});
    assert.equal(document.querySelector('[data-test-id="power-calendar-nav-title"]').textContent.trim(), "September 2018", 'Meta + ArrowLeft does not move calendar to previous month if it is out of range.');
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'ArrowRight');
    await triggerKeyEvent(this.element.querySelector('[data-test-type="power-datetime-picker"] [data-test-type="power-datepicker-date-trigger"]'), "keydown", 'Enter');
  });
});

// TODO when default date is out of minDate and maxDate range.
