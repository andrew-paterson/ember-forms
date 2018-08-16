import Component from '@ember/component';

export default Component.extend({
  classNames: ['in-page-alert'],
  classNameBindings: ['type', 'classes'],
});