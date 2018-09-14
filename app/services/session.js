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
    this.signupFormSchema = {
      title: 'Sign up form',
      formName: 'signUpForm',
      modelName: 'user',
      recordToUpdate: this.get('model'),
      fields: [
        {
          fieldId: 'name',
          label: 'Name',
          fieldType: 'input',
          validationRules: [{'validationMethod': 'required'}],
          validationEvents: ['focusOut', 'keyUp', 'insert'],
          inputType: 'text',
        },
        {
          fieldId: 'email',
          label: 'Email',
          fieldType: 'input',
          validationRules: [{'validationMethod': 'isEmail'}],
          inputType: 'email',
        },
        {
          fieldId: 'bio',
          label: 'Bio',
          fieldType: 'textarea',
          inputType: 'text',
        },
        {
          label: "Phone number",
          fieldId: "personal_details.phone_number",
          fieldType: "input",
          validationRules: [{'validationMethod': 'required'}],
          inputType: "text",
        },
        {
          fieldId: 'text',
          fieldType: 'textSeparator',
          text: "Physical Address",
          textElement: 'h3'
        },
        {
          label: "Address line 1",
          fieldId: "personal_details.address.address_line1",
          fieldType: "input",
          validationRules: [{'validationMethod': 'required'}],
          inputType: "text",
        },
        {
          label: "Country",
          fieldId: 'personal_details.address.country',
          fieldType: "select",
          validationRules: [{'validationMethod': 'required'}],
          options: [
            "Afghanistan",
            "Åland Islands",
            "Albania",
            "Algeria",
            "American Samoa",
            "Andorra",
            "Angola",
            "Anguilla",
            "Antarctica",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia"
          ],
        },
        {
          fieldId: 'acceptTerms',
          fieldType: "radioButtonGroup",
          label: 'Do you agree to the terms?',
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'equals', 'arguments': 'true', 'errorMessage': 'You must accept the terms to continue.'}],
          radioButtons: [{
            'label': 'I agree',
            'value': 'true'
          }, {
            'label': 'I do not agree',
            'value': 'false'
          }]
        },
        {
          label: "Birth date",
          fieldId: "personal_details.birth_date",
          fieldType: "date",
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isDate'}],
          validationEvents: ['insert'],
        },
        {
          fieldId: 'settings.mailing_list',
          fieldType: "singleCheckbox",
          validationRules: [{'validationMethod': 'required'}],
          label: 'Do you agree join the mailing list?'
        }
      ]
    };
    // this.exisitingUser =
  }
});