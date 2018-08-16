import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import TextField from '@ember/component/text-field';

export default TextField.extend({
  type: 'file',

  change: function(e) {
    var input = e.target;
    if (!isEmpty(input.files)) {
      this.send('sendFiles', input.files);
      $(".file-select-button")[0].reset();
    }
  },

  actions: {
    sendFiles: function(files) {
      this.sendFiles(files);
    },
  }
});