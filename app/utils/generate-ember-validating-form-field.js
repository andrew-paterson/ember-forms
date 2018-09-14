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

   if (!field.fieldId) {
    throw Error(`fieldId is a required field for validating form. This is missing in item ${index}.`);
  }

  // TODO this must go many levels deep and be it's own util.
  var checkKeyExists = (object, searchKey) => {
    for (var key in object) {
      if (key === searchKey) {
        return true;
      }
    }
    return false;
  };

  var fieldObject = EmberObject.create(field);

  if (field.fieldType === 'customComponent') {
    fieldObject.component = field.componentPath;
    return fieldObject;
  }

  var value;
  if (formSchema) {
    var fieldIdParts = field.fieldId.split('.');
    var thisPart = formSchema.recordToUpdate;
    fieldIdParts.forEach(function(part) {
      if (thisPart) {
        thisPart = thisPart[part];
        console.log(thisPart);
      }
    });
    value = thisPart;
  }
  if (field.default && (value === undefined || value === null)) {
    value = field.trim ? field.default.trim() : field.default;
  }

  var required;
  if (field.validationRules) {
    if (field.validationRules.findBy('validationMethod', 'required')) {
      required = true;
    }
  }

  // Inherit form form if not set on field.
  var hideSuccessValidation = false;
  if (checkKeyExists(field, 'hideSuccessValidation')) {
    hideSuccessValidation = field.hideSuccessValidation;
  } else if (formSchema) {
    if (formSchema.hideSuccessValidation) {
      hideSuccessValidation = formSchema.hideSuccessValidation;
    }
  }

  var hideLabel = false;
  if (checkKeyExists(field, 'hideLabel')) {
    hideLabel = field.hideLabel;
  } else if (formSchema) {
    if (formSchema.hideLabels) {
      hideLabel = formSchema.hideLabels;
    }
  }

  // fieldObject.set('error', null);
  fieldObject.set('value', value);
  fieldObject.set('hideSuccessValidation', hideSuccessValidation);
  fieldObject.set('hideLabel', hideLabel);
  fieldObject.set('required', required);
  fieldObject.set('component', fieldElementComponents[field.fieldType]);
  return fieldObject;
}
