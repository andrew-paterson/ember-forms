import Component from '@ember/component';

export default Component.extend({
  tagName: "div",
  classNames: ["checkbox-label-container"],
  classNameBindings: ["disabled:disabled"],

  actions: {
    checkboxClicked: function(value) {
      if (this.changedAction) {
        this.changedAction(value);
      }
    }
  }
});