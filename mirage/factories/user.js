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

  bio() {
    return faker.lorem.sentence();
  },

  personal_details() {
    return {
      birth_date: faker.date.past(),
      phone_number: faker.phone.phoneNumber(),
      address: {
        address_line1: faker.address.streetAddress(),
        country:  faker.address.country()
      }
    };
  },

  // personalDetails(i) {
  //   return 'Test';
  //   // return {
  //   //   "phone_number": faker.phone.phoneNumber(i),
  //   // }
  // }


});
