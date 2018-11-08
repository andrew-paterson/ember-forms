import Component from '@ember/component';

export default Component.extend({
  tagName: "div",
  classNames: ["labelled-checkbox"],
  classNameBindings: ["disabled:disabled"],

  actions: {
    checkboxClicked: function(value) {
      if (this.changedAction) {
        this.changedAction(value);
      }
    }
  }
});