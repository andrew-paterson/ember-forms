import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.JSONAPISerializer.extend({
  session: service(),

  // Do not convert underscores and camel case to hyphens
  // when serialising attribute names from the model to Ember Data.
  keyForAttribute(key) {
    return key;
  },

  serialize: function(snapshot) {
    var json = this._super.apply(this, arguments);
    var confirmation = this.get('session.passwordConfirmation');
    if (confirmation) {
      //adds the field 'confirmation' at the root of the json object.
      json.confirmation = confirmation;
    }
    return json;
  }
});