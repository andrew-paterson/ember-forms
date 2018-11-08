export default function httpErrorMessageGenerator(error, customFallbacks) {
  //Todo put these translations into a more accessible place.
  // error = error.replace('Could not login.', 'Login failed. Please check your username and password and try again.')
  // .replace('param is missing or the value is empty: authorisation', 'Please fill in both the email and password field.')
  // .replace('Email has already been taken', 'This email address is already registered.');

  // customFallbacks = customFallbacks || {};
  // var defaultFallbacks = {
  //   '400s': 'An error occurred. Please try again.',
  //   '500s': 'A network error occurred. Please try again.'
  // }
  // var errorDetail;
  // var errorStatus = error.status;
  // var statusFirstChar = parseInt(errorStatus.split("")[0]);
  //   if (statusFirstChar === 4) {
  //     if (error.detail) {
  //       errorDetail = error.detail;
  //     } else if (customFallbacks['400s']) {
  //       errorDetail = customFallbacks['400s'];
  //     } else {
  //       errorDetail = defaultFallbacks['400s'];
  //     }
  //   }
  //   if (statusFirstChar === 5 || statusFirstChar === 0) {
  //     if (customFallbacks['500s']) {
  //       errorDetail = customFallbacks['500s'];
  //     } else {
  //       errorDetail = defaultFallbacks['500s'];
  //     }
  //   }
  return error;
}