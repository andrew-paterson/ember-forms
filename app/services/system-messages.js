import Service from '@ember/service';

export default Service.extend({
  init() {
    this._super(...arguments);
    //The 'routeMetaTitle' property of each route that can have system messages.
    this.routes = {
      'dashboard': null,
      'landing': null,
      'createJob': null,
      'jobsList': null,
      'fullResults': null,
      'signup': null,
      'login': null,
      'editAccount': null,
      'changePassword': null,
      'forgotPassword': null,
      'resetPassword': null,
      'updateLicence': null,
    }
  },
});
//LIST OF ALL MESSAGES CREATED IN THE APP BY NAME.
//-----------------------------------
//UI STATE
//-----------------------------------
//CREATE JOB
// reselectFiles
// noValidFilesSelected
// sampleDetailsFileErrors
//GENERAL FORMS
// signupFormErrorsMessage
// changePasswordFormErrors
// editAccountFormErrors
// forgotPasswordFormErrors
// loginFormErrors
// resetPasswordFormErrors
//AUTHENTICATION
// authenticationFailed
// MISC
// passwordRequired
//-----------------------------------
// SERVER RESPONSES
//-----------------------------------
// JOBS LIST
// jobFinishedResponse
// deleteJobsResponse
// submitJobResponse
// GENERAL FORMS
// loginResponse
// resetPasswordResponse
// signupResponse
// forgotPasswordResponse
// editAccountResponse
// changePasswordResponse
// updateLicenseResponse