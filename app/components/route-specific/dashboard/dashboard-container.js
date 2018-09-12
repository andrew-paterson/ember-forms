import Component from '@ember/component';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  systemMessages: service(),
  tagName: '',

  didInsertElement: function() {
    var user = EmberObject.create({
      name: null,
      email: "andrew@hyraxbio.co.za"
    });
    this.saveNewRecord(user, 'user').then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error.errors[0]);
    });
  }
});