import Service from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  navCollapsed: false,
  hideContent: null,
  placeholdersSupported: '',
  fileAPISupported: '',
  init() {
    this._super(...arguments);
    this.userUiState = {};
  }
});