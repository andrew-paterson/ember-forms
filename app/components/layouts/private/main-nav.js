import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  tagName: 'div',
  classNames: ['nav-sidebar'],
  classNameBindings: ['session.navCollapsed:nav-collapsed', 'session.navToggled:nav-toggled'],

  actions: {
    toggleFullNav: function() {
      this.toggleProperty('session.navCollapsed');
      localStorage.setItem('userNavCollapsed', this.get('session.navCollapsed'));
      this.set('session.navToggled', true);
    },
  }
});