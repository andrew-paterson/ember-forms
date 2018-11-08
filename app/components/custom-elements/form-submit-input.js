import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  tagName: 'button',
  classNames: ['submit-input-container', 'spinner-container', 'large'],
  classNameBindings: ['requestInFlight:spin', 'classes'],
  attributeBindings: ['customType:type'],
  customType: 'submit'
});