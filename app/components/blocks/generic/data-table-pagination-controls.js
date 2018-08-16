import Component from '@ember/component';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  tagName: 'div',
  classNames: ['table-pagination'],
  classNameBindings: ['class'],

  paginationObject: computed('paginationLinks', function() {
    var paginationLinks = this.get('paginationLinks');
    var paginationObject = {};
    $.each(paginationLinks, function(key, val) {
      var queryParamsString = val.split('?')[1];
      var queryParams = queryParamsString.split('&');
      paginationObject[key] = {};
      queryParams.forEach(function(keyValuePair) {
        const [param, value] = keyValuePair.split('=');
        if (param === 'page%5Bnumber%5D') {
          if (value) {
            paginationObject[key]["number"] = value;
          }
        }
      });
    });
    return paginationObject;
  }),

  pageSizeIncrement: computed('pageSize', function() {
    return this.get('pageSize') + 10;
  }),

  pageSizeDecrement: computed('pageSize', function() {
    return this.get('pageSize') - 10;
  })
});