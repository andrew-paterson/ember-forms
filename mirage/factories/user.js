import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  // name(i) {
  //   return `Author ${i}`;
  // },

  name() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },

  test: faker.list.cycle('gmail', 'yahoo', 'hotmail'),
  email() {
    return `${this.name.toLowerCase().replace(' ', '.')}@${this.test}.com`;
  },
  country() {
    return faker.address.country();
  },
});
