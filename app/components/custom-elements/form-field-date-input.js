import ValidatingFormField from 'ember-starter/components/extensible/validating-form-field'

export default ValidatingFormField.extend({
  didRender: function() {
    if (!this.get('format')) {
      this.set("format", "dd-mm-yyyy");
    }
  },
});