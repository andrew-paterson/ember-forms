import Component from '@ember/component';

export default Component.extend({
  didRender: function() {
    if (!this.get('format')) {
      this.set("format", "dd-mm-yyyy");
    }
  },
});