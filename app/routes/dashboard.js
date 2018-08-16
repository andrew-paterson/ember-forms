import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  licenseRequired: true,
  authenticationRequired: true,
  pageTitlePrefix: 'Dashboard',
  routeMetaTitle: 'dashboard',
});