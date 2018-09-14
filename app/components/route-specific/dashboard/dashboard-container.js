import Component from '@ember/component';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  systemMessages: service(),
  tagName: '',
});