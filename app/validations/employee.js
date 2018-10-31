import defaultValidations from 'ember-changeset-validations/validators';
import validateCustom from '../validators/custom'; // local validator
// import validatePasswordStrength from '../validators/password-strength'; // local validator

export default {
  name: [
    defaultValidations.validatePresence(true),
    defaultValidations.validateLength({ min: 4 })
  ],
  lastName: defaultValidations.validatePresence(true),
  // age: validateCustom({ foo: 'bar' }),
  age: defaultValidations.validateNumber({ gte: 18 }),
  email: defaultValidations.validateFormat({ type: 'email' }),
  password: [
    defaultValidations.validateLength({ min: 8 }),
    // validatePasswordStrength({ minScore: 80 })
  ],
  passwordConfirmation: defaultValidations.validateConfirmation({ on: 'password' })
};