import Component from '@ember/component';

export default Component.extend({
  type: 'div',
  classNames: ['input-file-wrapper', 'button'],
  classNameBindings: ['classes'],

  actions: {
    sendFiles: function(files) {
      this.fileProcessingAction(files, this.get('allowedFileTypesList'));
    },
  }
});