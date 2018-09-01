import EmberObject from '@ember/object';

export default function generateEmberValidatingFormField(field, index, formSchema, existing) {
  var fieldElementComponents = {
    "input": "custom-elements/form-field-input",
    "textarea": "custom-elements/form-field-textarea",
    "select": "custom-elements/form-field-power-select",
    "date": "custom-elements/form-field-date-input",
    "singleCheckbox": "custom-elements/form-field-checkbox",
    "radioButtonGroup": "custom-elements/radio-button-group",
    "textSeparator": "custom-elements/form-field-text-separator"
  };

  var fieldObject = EmberObject.create({
    fieldType: field.fieldType,
    component: fieldElementComponents[field.fieldType],
  });
  if (field.fieldType === 'textSeparator') {
    fieldObject.text = field.text;
    fieldObject.textElement = field.textElement;
    return fieldObject;
  }
  if (field.fieldType === 'customComponent') {
    fieldObject.component = field.componentPath;
    return fieldObject;
  }
  if (!field.fieldId) {
    throw Error(`fieldId is a required field for validating form. This is missing in item ${index}.`);
  }
  var value;
  if (existing) {
    for (var key in existing) {
      if (key = field.propertyName) {
        value = existing[key]
      }
    }
  }

  if (value === undefined || value === null && field.default) {
    value = field.default;
  }
  var hideSuccessValidation;
  if (field.hideSuccessValidation !== null && field.hideSuccessValidation !== undefined) {
    hideSuccessValidation = field.hideSuccessValidation;
  } else {
    hideSuccessValidation = formSchema.hideSuccessValidation;
  }
  var showLabel;
  if (field.showLabel !== null && field.showLabel !== undefined) {
    showLabel = field.showLabel;
  } else {
    showLabel = formSchema.showLabels;
  }
  var required;
  if (field.validationRules) {
    if (field.validationRules.findBy('validationMethod', 'required')) {
      required = true;
    }
  }

  fieldObject.error = null;
  fieldObject.value = value;
  fieldObject.hideSuccessValidation = hideSuccessValidation;
  fieldObject.showLabel = showLabel;
  fieldObject.required = required;

  fieldObject.fieldId = field.fieldId;
  fieldObject.validationEvents = field.validationEvents;
  fieldObject.radioButtons = field.radioButtons;
  fieldObject.propertyName = field.propertyName;
  fieldObject.label = field.label;
  fieldObject.labelComponent = field.labelComponent;
  fieldObject.default = field.default;
  fieldObject.fieldUpdatedAction = field.fieldUpdatedAction;

  fieldObject.validateOnInsert = field.validateOnInsert;
  fieldObject.validationRules = field.validationRules;
  //For input fields
  fieldObject.inputType = field.inputType;
  fieldObject.trim = field.trim;
  // For power select
  fieldObject.options = field.options;
  // For date inputs
  fieldObject.startDate = field.startDate;
  fieldObject.endDate = field.endDate;
  fieldObject.format = field.format;
  fieldObject.text = field.text;
  fieldObject.class = field.class;
  fieldObject.disabled = field.disabled;

  fieldObject.validationEvents = field.validationEvents;
  return fieldObject;
}
