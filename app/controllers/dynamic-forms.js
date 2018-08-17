import Controller from '@ember/controller';
import GeneralControllerActionsMixin from 'ember-starter/mixins/controllers/general-controller-actions';
import { alias } from '@ember/object/computed';

export default Controller.extend(GeneralControllerActionsMixin, {
  systemMessage: alias('systemMessages.routes.dynamicForms'),

  actions: {
    formSubmit: function() {
      console.log('submitted');
    }
  }
});