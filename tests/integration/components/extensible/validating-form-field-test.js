import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, focus, blur, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | extensible/validating-form-field', function(hooks) {
  setupRenderingTest(hooks);

  test('Basic rendering', async function(assert) {
    var fieldSchema = {
      fieldId: 'testInput',
      label: 'Test Input',
      fieldType: 'input',
    }
    var formSchema = {
      hideLabels: true,
    }
    this.set('fieldSchema', fieldSchema);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.ok(this.element.querySelector('label').textContent === 'Test Input', 'Label renders correctly.');
    assert.ok(this.element.querySelector('input').placeholder === 'Test Input', 'Placeholder renders as label by default.');
    assert.ok(this.element.querySelector('input'), 'Input is rendered');
    assert.ok(this.element.querySelector('input').type === 'text', 'Input renders as type text if inputType is not specified.');

    this.set('fieldSchema.autoFocus', true);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.ok(this.element.querySelector('input:focus'), '[Autofocus] Input is correctly auto focussed when the "autoFocus" property is true.');

    this.set('fieldSchema.inputType', 'number');
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.ok(this.element.querySelector('input').type === 'number', 'Input renders as type number if inputType is "number".');

    this.set('fieldSchema.inputType', 'text');
    this.set('fieldSchema.default', ' Default text ');
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('input').value === ' Default text ', 'Default value renders in input, is not trimmed by default.');

    this.set('fieldSchema.trim', true);
    this.set('fieldSchema.hideLabel', true);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.ok(this.element.querySelector('input').value === 'Default text', 'When trim is true, default values are trimmed when field is inserted.');
    assert.notOk(this.element.querySelector('label'), 'Label does not render if "hideLabel" is true.');

    await fillIn(this.element.querySelector('input'), ' Default text ');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.ok(this.element.querySelector('input').value === ' Default text ', 'Trimming does not happen on "keyUp", even if trim is set to true.');

    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('input').value === 'Default text', 'When trim is true, value is trimmed on blur.');

    this.set('fieldSchema.validationRules', [{'validationMethod': 'required'}]);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="svg-icon-asterisk"]'), 'Required icon displays if required is passed as a validation rule.');
    assert.ok(this.element.querySelector('div').classList.contains('required'), 'Required class added to fields with "required" as a validationMenthod.');


    // Template block usage:
    // await render(hbs`
    //   {{#extensible/validating-form-field}}
    //     template block text
    //   {{/extensible/validating-form-field}}
    // `);

    // assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('General validation', async function(assert) {
    var fieldSchema = {
      fieldId: 'testInput',
      label: 'Test Input',
      fieldType: 'input',
      validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isEmail'}],
      inputType: 'text',
      default: '',
    }

    this.set('fieldSchema', fieldSchema);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    await focus(this.element.querySelector('input'));
    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('[data-test-id="svg-icon-alert"]'), 'Alert icon displays if validation is failed.');
    assert.equal(this.element.querySelector('[data-test-id="field-error"]').textContent, 'This field is required.', 'Correct error message shows on focus out of a required field which is empty.');
    assert.notOk(this.element.querySelector('div').classList.contains('valid'), "Valid class does not display on invalid field.");
    assert.ok(this.element.querySelector('div').classList.contains('invalid'), "Invalid class displays on invalid field.");
    assert.ok(this.element.querySelector('[data-test-id="field-error"] [data-test-id="svg-icon-curved-arrow-right"]'), 'Arrow icon displays with error message.');

    await focus(this.element.querySelector('input'));
    assert.notOk(this.element.querySelector('[data-test-id="field-error"]') || this.element.querySelector('div').classList.contains('invalid') , 'Validation errors and classes are removed on focus in.');

    await fillIn(this.element.querySelector('input'), 'test');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('[data-test-id="field-error"]') && this.element.querySelector('[data-test-id="field-error"]').textContent !== 'This field is required.', 'Validation rules are applied in the order that they are passed.');

    this.set('fieldSchema.hideSuccessValidation', true);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    await fillIn(this.element.querySelector('input'), 'lil-s@pawnee-gov.com');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await blur(this.element.querySelector('input'));
    assert.notOk(this.element.querySelector('div').classList.contains('valid') || this.element.querySelector('div').classList.contains('invalid'), 'Valid class does not display on valid field where "hideSuccessValidation" is true.');

    await fillIn(this.element.querySelector('input'), 'lil-s');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('[data-test-id="field-error"]'), 'Validation error shows where validation fails and "hideSuccessValidation" is true.');

    this.set('fieldSchema.hideSuccessValidation', null);
    this.set('fieldSchema.validationRules', [{'validationMethod': 'required', 'errorMessage': 'Custom validation error message.'}]);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    await focus(this.element.querySelector('input'));
    await blur(this.element.querySelector('input'));
    assert.equal(this.element.querySelector('[data-test-id="field-error"]').textContent, 'Custom validation error message.', 'Custom validation error message displays if passed.');

  });

  test('Custom Validation Events', async function(assert) {
    var fieldSchema = {
      fieldId: 'testInput',
      label: 'Test Input',
      fieldType: 'input',
      validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isEmail'}],
      inputType: 'text',
      default: '',
    }
    this.set('fieldSchema', fieldSchema);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    await focus(this.element.querySelector('input'));
    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('[data-test-id="field-error"]'), 'Validation occurs on focus out, even if "validationEvents" is not part of the field schema.');

    this.set('fieldSchema.validationEvents', ['insert']);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.notOk(this.element.querySelector('[data-test-id="field-error"]'), 'Validation does not occur on insert if default value is null, even if "insert" is passed as a validation event.');

    this.set('fieldSchema.default', 'Test');
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    assert.ok(this.element.querySelector('[data-test-id="field-error"]'), 'Field with "insert" as a validation event validates when inserted with a default value.');
    await fillIn(this.element.querySelector('input'), 'test');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.notOk(this.element.querySelector('[data-test-id="field-error"]'), 'Validation error does not show on keyUp, when keyUp not given as validation event for input, and input value is invalid.');

    this.set('fieldSchema.default', '');
    this.set('fieldSchema.validationEvents', ['keyUp']);
    await render(hbs`{{extensible/validating-form-field fieldSchema=fieldSchema}}`);
    await fillIn(this.element.querySelector('input'), 'test');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.ok(this.element.querySelector('[data-test-id="field-error"]'), 'Validation error shows on keyUp, when keyUp given as validation event for input, and input value is invalid.');
    await fillIn(this.element.querySelector('input'), 'lil-s@pawnee-gov.com');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.ok(this.element.querySelector('div').classList.contains('valid'), "Success validation works on key up.");
    await fillIn(this.element.querySelector('input'), '');
    await triggerKeyEvent(this.element.querySelector('input'), "keyup", 1);
    assert.notOk(this.element.querySelector('[data-test-id="field-error"]'), 'Validation error is removed on keyUp, when keyUp given as validation event for input, and input value is an empty string (When all text in input is backspaced).');
    await blur(this.element.querySelector('input'));
    assert.ok(this.element.querySelector('[data-test-id="field-error"]'), 'Validation error on focus out of a field that has keyUp as a validation method, and fails validation.');

  });
});
