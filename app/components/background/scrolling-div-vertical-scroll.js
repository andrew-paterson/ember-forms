import Component from '@ember/component';
import { PerfectScrollbarMixin } from 'ember-perfect-scrollbar';

export default Component.extend(PerfectScrollbarMixin, {
  classNameBindings: ['customClasses'],
  init() {
    this._super(...arguments);
    this.perfectScrollbarOptions = {
      suppressScrollX: true,
      maxScrollbarLength: 200,
      minScrollbarLength: 40,
      wheelPropagation: true,
      swipePropagation: true,
    };
  }
});