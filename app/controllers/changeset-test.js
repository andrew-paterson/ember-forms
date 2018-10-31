import Controller from '@ember/controller';
import { computed } from '@ember/object';
import Ember from 'ember';
// import EmployeeValidations from '../validations/employee';
import all from 'ember-changeset-validations/validators';

export default Controller.extend({
  init: function() {
    this._super(...arguments);
    this.userValidations = {
      name: [
        all.validatePresence(true),
        all.validateLength({ min: 4 })
      ],
      lastName: all.validatePresence(true),
      // age: validateCustom({ foo: 'bar' }),
      age: all.validateNumber({ gte: 18 }),
      email: all.validateFormat({ type: 'email' }),
      password: [
        all.validateLength({ min: 8 }),
        // validatePasswordStrength({ minScore: 80 })
      ],
      passwordConfirmation: all.validateConfirmation({ on: 'password' }),
      'personal_details.address.address_line1': all.validatePresence(true),

    }
  },

  user: computed('model', function() {
    return this.get('model').firstObject;
  }),

  actions: {
      submit(changeset) {
        return changeset.save();
      },

      rollback(changeset) {
        return changeset.rollback();
      },

      validate({ key, newValue, oldValue, changes, content }) {
        // lookup a validator function on your favorite validation library
        // should return a Boolean
      }
    }
});
