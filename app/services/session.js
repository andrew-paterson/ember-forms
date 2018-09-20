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
          fieldLabel: 'Name',
          fieldType: 'input',
          validationRules: [{'validationMethod': 'required'}],
          validationEvents: ['focusOut', 'keyUp', 'insert'],
          inputType: 'text',
        },
        {
          fieldId: 'email',
          fieldLabel: 'Email',
          fieldType: 'input',
          validationRules: [{'validationMethod': 'isEmail'}],
          inputType: 'email',
        },
        {
          fieldId: 'bio',
          fieldLabel: 'Bio',
          fieldType: 'textarea',
          inputType: 'text',
        },
        {
          fieldLabel: "Phone number",
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
          fieldLabel: "Address line 1",
          fieldId: "personal_details.address.address_line1",
          fieldType: "input",
          validationRules: [{'validationMethod': 'required'}],
          inputType: "text",
        },
        {
          fieldLabel: "Country",
          fieldId: 'personal_details.address.country',
          fieldType: "select",
          validationRules: [{'validationMethod': 'required'}],
          searchPlaceholder: 'Search Countries',
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
          fieldLegend: 'Do you agree to the terms?',
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'equals', 'arguments': 'true', 'errorMessage': 'You must accept the terms to continue.'}],
          options: [{
            'label': 'I agree',
            'value': 'true'
          }, {
            'label': 'I do not agree',
            'value': 'false'
          }]
        },
        {
          fieldId: 'colours',
          fieldType: "checkboxGroup",
          fieldLegend: 'Choose at least one colour',
          validationRules: [{'validationMethod': 'custom'}],
          // validationEvents: ['insert'],
          options: [{
            'key': 'red',
            'label': 'Red'
          }, {
            'key': 'orange',
            'label': 'Orange'
          },{
            'key': 'yellow',
            'label': 'Yellow'
          },{
            'key': 'green',
            'label': 'Green'
          },{
            'key': 'blue',
            'label': 'Blue'
          },],
          default: ['red', 'green']
        },
        {
          fieldLabel: "Birth date",
          fieldId: "personal_details.birth_date",
          fieldType: "date",
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isDate'}],
          validationEvents: ['insert'],
          autoclose: true
        },

        {
          fieldLabel: "Death date",
          fieldId: "personal_details.death_date",
          fieldType: "datePikaday",
          validationRules: [{'validationMethod': 'required'}, {'validationMethod': 'isDate'}],
          validationEvents: ['insert'],
          // useUTC: true,
          // disabled: true,
          options: {
            numberOfMonths: 2,
            disableWeekends: true,
            minDate: moment("2018-09-01").toDate(),
            maxDate: moment("2018-10-01").toDate(),
            format: "DD/MM/YYYY",
            //
          }
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