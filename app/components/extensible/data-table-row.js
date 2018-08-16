import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  expandCollapseIcon: computed('expanded', function() {
    var icon = this.get('expanded') ? 'svg/icon-dash' : 'svg/icon-plus';
    return icon;
  }),

  actions: {
    expandRow: function() {
      this.toggleProperty('expanded');
    },

    toggleSelected: function(item) {
      item.toggleProperty("selected");
    },

    toggleJobInfo: function() {
      this.toggleProperty('job.showInfo');
    },
  }
});