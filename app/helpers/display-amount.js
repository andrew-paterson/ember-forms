import { helper } from '@ember/component/helper';

export function spacedNumber(params/*, hash*/) {
  var string = params[0].toFixed(2).toString();
  var stringArray = string.split('.');
  var whole = stringArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return whole + '.' + stringArray[1];
}

export default helper(spacedNumber);
