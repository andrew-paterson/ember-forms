import { module, test } from 'qunit';
import { visit, currentURL, fillIn, focus, find, blur, click, triggerKeyEvent, triggerEvent} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | web form', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /web-form', async function(assert) {
    await visit('/signup');
    await fillIn('[data-test-id="validating-field-name"] input', `Lil' Sebastian`);
    await triggerKeyEvent('[data-test-id="validating-field-name"] input', "keyup", 1);
    assert.ok(find('[data-test-id="validating-field-name"]').classList.contains('valid'), "Keyup event adds valid class on input with keyUp validation when user types a valid key.");
    await fillIn('[data-test-id="validating-field-name"] input', ``);
    await triggerKeyEvent('[data-test-id="validating-field-name"] input', "keyup", 1);
    assert.notOk(find('[data-test-id="validating-field-name"]').classList.contains('valid'), "Keyup event removes valid class on input with keyUp validation if all text in input is backspaced.");
    assert.notOk(find('[data-test-id="validating-field-name"]').classList.contains('invalid'), "Keyup event does not add invalid class on input with keyUp validation on input with keyUp validation if all text in input is backspaced.");

    await blur('[data-test-id="validating-field-name"] input');
    assert.ok(find('[data-test-id="validating-field-name"]').classList.contains('invalid'), "Focussing out of input with Keyup event adds invalid class on input with keyUp validation on input with keyUp validation if the input is empty.");
    await fillIn('[data-test-id="validating-field-email"] input', ``);
    await triggerKeyEvent('[data-test-id="validating-field-email"] input', "keyup", 1);
    assert.notOk(find('[data-test-id="validating-field-email"]').classList.contains('invalid'), "Keyup event does not add invalid class on input without keyUp validation, even if input value is invalid.");
    await blur('[data-test-id="validating-field-email"] input');
    assert.ok(find('[data-test-id="validating-field-email"]').classList.contains('invalid'), "Focussing out of required input adds invalid class if the input is empty.");
    await fillIn('[data-test-id="validating-field-email"] input', `Ice Clown`);
    await blur('[data-test-id="validating-field-email"] input');
    assert.ok(find('[data-test-id="validating-field-email"]').classList.contains('invalid'), "Focussing out of field with isEmail validation produces adds invalid class when value is not a valid email.");
    return this.pauseTest();
  });
});
