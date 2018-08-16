import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  classNames: ['submit-input-container', 'spinner-container', 'button', 'large'],
  classNameBindings: ['requestInFlight:spin', 'classes'],
});