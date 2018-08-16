import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  session: service(),
  host: ENV.apiProtocol + ENV.apiHost,
  namespace: 'v1',
});