import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  tagName: 'div',
  classNames: ['system-message'],
  classNameBindings: ['systemMessage.type'],
  attributeBindings: ['data-test-id'],

  messageIcon: computed('systemMessage.type', function() {
    return this.get('systemMessage.type') === 'success' ? 'svg/icon-tick' : 'svg/icon-alert';
  }),

  actions: {
    dismissMessage: function() {
      this.set('systemMessage', null);
    }
  }
});