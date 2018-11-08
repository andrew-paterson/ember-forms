import Controller from '@ember/controller';
import GeneralControllerActionsMixin from 'ember-starter/mixins/controllers/general-controller-actions';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import generateEmberValidatingFormFields from 'ember-starter/utils/generate-ember-validating-form-fields';

export default Controller.extend(GeneralControllerActionsMixin, {
  session: service(),
  systemMessage: alias('systemMessages.routes.editAccount'),

  user: computed('model', function() {
    return this.get('model').firstObject;
  }),

  processedFormSchema: computed('session.signupFormSchema', 'user', function() {
    var signupFormSchema = this.get('session.signupFormSchema');
    signupFormSchema.recordToUpdate = this.get('user');
    return generateEmberValidatingFormFields(this.get('session.signupFormSchema'));
  }),
});