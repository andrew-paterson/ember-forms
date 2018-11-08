import EmberObject from '@ember/object';
import generateEmberValidatingFormField from 'ember-starter/utils/generate-ember-validating-form-field';

export default function generateEmberValidatingFormFields(formSchema, existing) {
  var generateFormMetaData = function(formSchema) {
    var formMetaData = EmberObject.create();
    for (var key in formSchema) {
      if (formSchema.hasOwnProperty(key)) {
        if (key !== 'fields') {
          formMetaData[key] = formSchema[key];
        }
      }
    }
    if (formMetaData.submitSuccessMessage === null || formMetaData.submitSuccessMessage === undefined) {
      formMetaData.submitSuccessMessage = "Success";
    }

    if (formMetaData.resetAfterSubmit === null || formMetaData.resetAfterSubmit === undefined) {
      formMetaData.resetAfterSubmit = true;
    }
    return formMetaData;
  };

  var generateformFields = function(formSchema, existing) {
    if (!formSchema) {return;}
    var schemaFields = formSchema.fields;
    if (!schemaFields) {return;}
    var formFields = [];
    schemaFields.forEach(function(field, index) {
      var fieldObject = generateEmberValidatingFormField(field, index, formSchema, existing);
      formFields.pushObject(fieldObject);
    });
    return formFields;
  }

  var generateChangeset = function(formFields) {
    formFields.forEach(formField => {
    })
    return formFields;
  }

  return {
    formFields: generateformFields(formSchema, existing),
    formMetaData: generateFormMetaData(formSchema),
    formSchema: formSchema
  }
}