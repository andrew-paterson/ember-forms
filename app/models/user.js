import DS from 'ember-data';

export default DS.Model.extend({
  acceptTerms: DS.attr('string'),
  name: DS.attr('string'),
  email: DS.attr('string'),
  bio: DS.attr('string'),
  personal_details: DS.attr(),
  settings: DS.attr(),

});
