import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  firstname() {
    return faker.name.firstName();
  },

  lastname() {
    return faker.name.lastName();
  },
  fullname() {
    return this.firstname + ' ' + this.lastname;
  },
  email() {
    return faker.internet.email();
  },
  date: '06/25/1975',
  isAdmin: false,

  password: 2345,
});
