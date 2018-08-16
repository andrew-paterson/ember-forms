import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';

export default Component.extend({
  session: service(),
  tagName: 'header',
  classNameBindings: ['systemMessage:system-message-active', 'systemMessage.type'],
});