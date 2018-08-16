import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  actions: {
    loading(transition) {
      var self = this;
      this.set('session.hideContent', true);
      transition.promise.finally(function() {
        self.set('session.hideContent', false);
      });
    },
    refreshModel() {
      this.refresh();
    },

    saveNewRecord: function(values, modelName) {
      var record = this.store.createRecord(modelName, values);
      return record.save();
    },

    updateRecord: function(record) {
      return record.save();
    },
  }
});