export default function validateField(formField, formFields, customValidations) {
  var errorMessage;
  // var self = this;
  var value = formField.value || '';
  var stringValue = value.toString();
  var validationRules = formField.validationRules || [];
  formField.set("error", null); // To ensure the error message updates, if the field has been updated but now fails a different validation rule to the previous validation attempt.
  validationRules.forEach(function(validationRule) {
    var validationMethod = validationRule.validationMethod;
    var validationArgs = validationRule.arguments;
    var customErrorMessage = validationRule.errorMessage;
    validationMethod = validationMethod === "isDate" ? "toDate" : validationMethod;
    if (formField.get("error")) {return;} // Stop validation if any validation rule is not passed.
    // Validate required fields.
    if (validationMethod === "required") {
      if (validator.isEmpty(stringValue)) {
        errorMessage = customErrorMessage || "This field is required.";
      } else {
        errorMessage = false;
      }
    // Validate all other types of fields
    } else if (validator[validationMethod]) {
      if (!validator[validationMethod](stringValue, validationArgs)) {
        errorMessage = customErrorMessage || `This is not a valid  value. Please try again.`;
        return errorMessage;
      } else {
        errorMessage = false;

      }
    }
  });
  return errorMessage;
}


