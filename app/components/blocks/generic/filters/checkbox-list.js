import Component from '@ember/component';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';

export default Component.extend({
  classNames: ["filter-box", "checkbox-list"],
  classNameBindings: ["class"],

  labelsArray: computed('labels', function() {
    return this.get('labels').split(", ");
  }),

  optionsObject: computed('labelsArray', function() {
    var self = this;
    var labelsArray = this.get('labelsArray') || [];
    var optionsObjectArray = [];
    labelsArray.forEach(function(label) {
      var boundPropertyName = label.toLowerCase().replace(" ", "_");
      var object = EmberObject.create({
        label: label,
        boundPropertyName: boundPropertyName,
        boundProperty: self.get(boundPropertyName)
      });
      optionsObjectArray.pushObject(object);
    });
    return optionsObjectArray;
  }),
});