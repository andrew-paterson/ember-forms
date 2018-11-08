export default function validateField(formField) {
  var errorMessage;
  var value = formField.value || '';
  var stringValue = value.toString();
  var validationRules = formField.validationRules || [];
    validationRules.forEach(function(validationRule) {
      var validationMethod = validationRule.validationMethod;
      var validationArgs = validationRule.arguments;
      var customErrorMessage = validationRule.errorMessage;
      validationMethod = validationMethod === "isDate" ? "toDate" : validationMethod;

      if (errorMessage) {return;} // Stop validation if any validation rule is not passed.
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
        } else {
          errorMessage = false;

        }
      }
    });
  return errorMessage;
}


