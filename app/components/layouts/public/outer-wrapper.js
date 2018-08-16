import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  classNames: ['wrapper', 'public'],
  classNameBindings: ['classes', 'session.placeholdersSupported:placeholders'],
});