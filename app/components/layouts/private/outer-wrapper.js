import Component from '@ember/component';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';

export default Component.extend({
  session: service(),
  tagName: 'div',
  classNames: ['wrapper', 'interface'],
  classNameBindings: ['classes', 'session.navCollapsed:nav-collapsed', 'session.navToggled:nav-toggled', 'session.placeholdersSupported:placeholders', 'interfaceTopBar:top-bar-present', 'session.userUiState.freezeNavigation:nav-frozen', 'session.hideContent:hide-content:show-content'],

  willRender: function() {
    once(this, function() {
      this.set('session.navCollapsed', JSON.parse(localStorage.getItem('userNavCollapsed')));
    });
  },

  didInsertElement: function() {
    var self = this;
    this.set('initialLoad', true);
    if (this.get('session.hideContent')) {
      setTimeout(function() {
        if (self.get('initialLoad')) {
          self.set('session.hideContent', false);
        }
      }, 20000);
    }
  },

  turnOffInitialLoad: observer('session.hideContent', function() {
    if (this.get('session.hideContent') === false) {
      this.set('initialLoad', false);
    }
  }),
});