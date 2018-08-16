import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: "div",
  classNames: ["checkbox-label-container", "select-all-checkbox"],
  classNameBindings: ["disabled:disabled", "collectionState"],

  collectionState: computed("relatedCollection.@each.selected", function() {
    if (!this.get("relatedCollection")) {
      return;
    }
    if (!this.get("relatedCollection").isEvery("selected", true) && this.get("relatedCollection").isAny("selected", true)) {
      return "some-selected";
    } else if (this.get("relatedCollection").isEvery("selected", true)) {
      return "all-selected";
    } else if (!this.get("relatedCollection").isAny("selected", true)) {
      return "none-selected";
    }
  }),

  actions: {
    sendChangedAction: function() {
      // The selectValue is what the action will set each item's "selected" attribute to.
      var selectAllValue = this.get("collectionState") === "all-selected" ? false : true;
      if (this.changedAction) {
        this.changedAction("selected", selectAllValue);
      }
    }
  }
});