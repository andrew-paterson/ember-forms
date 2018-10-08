import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, focus, blur, fillIn, isSettled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';



module('Integration | Component | custom-elements/form-field-power-datepicker', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    await render(hbs`{{custom-elements/form-field-power-datepicker}}`);

  });
});
