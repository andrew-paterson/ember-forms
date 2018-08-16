import Component from '@ember/component';

export default Component.extend({
  classNames: ['draggable-dropzone'],
  classNameBindings: ['dragClass', 'classes'],
  dragClass: 'deactivated',

  dragLeave: function(event) {
    event.preventDefault();
    return this.set('dragClass', 'deactivated');
  },

  dragOver: function(event) {
    event.preventDefault();
    return this.set('dragClass', 'activated');
  },

  drop: function(event) {
    event.preventDefault();
    var files;
    this.set('dragClass', 'deactivated');
    files = event.dataTransfer.files;
    this.fileProcessingAction(files, this.get('allowedFileTypesList'));
  },
});