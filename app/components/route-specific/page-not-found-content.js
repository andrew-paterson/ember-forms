import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  session: service(),
  authenticationRequired: false,

  didInsertElement: function() {
    once(this, function() {
      var pathArray = location.href.split('/');
      var protocol = pathArray[0];
      var host = pathArray[2];
      var url = protocol + '//' + host;
      var route = pathArray[3];
      this.set('baseUrl', url);
      this.set('routePath', route);
    });
  }
});