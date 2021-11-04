import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

let Tagarray = ['Weather', 'Foods', 'Minimalism'];
let authorArray = [
  {
    id: 1,
    firstname: 'Bruno',
    lastname: 'Michaelis',
    email: 'bruno.michaelis@icgroupinc.com',
    date: '06/18/1990',
    isAdmin: true,
    password: '1234',
    blogname: 'Funny Things'
  },
  {
    id: 2,
    firstname: 'Brandyn',
    lastname: 'Sparks',
    email: 'brandyn.sparks@icgroupinc.com',
    date: '10/25/1993',
    isAdmin: true,
    password: '1234',
    blogname: 'My Dairy'
  },
  {
    id: 3,
    firstname: 'Daphne',
    lastname: 'Truong',
    email: 'daphne.truong@icgroupinc.com',
    date: '05/01/1992',
    isAdmin: true,
    password: '1234',
    blogname: 'Weather'
  },
  {
    id: 4,
    firstname: 'Clover',
    lastname: 'Nguyen',
    email: 'cloverdn@gmail.com',
    date: '04/08/2000',
    isAdmin: false,
    password: '1234',
    blogname: 'Lucky'
  },
];

export default Factory.extend({
  
  title() {
    return faker.lorem.sentence();
  },

  body() {
    return faker.lorem.paragraph();
  },

  tag() {
    return faker.random.arrayElement(Tagarray);
  },

  publishedAt() {
    let fullDate = faker.date.past();
    let fullDateString = fullDate.toString();
    let dateTime = fullDateString.slice(0, 24);
    return dateTime;
  },
  image() {
    return faker.random.image();
  },
  isActive() {
    return faker.datatype.boolean();
  },
  author() {
    return faker.random.arrayElement(authorArray);
  },
  authorId() {
    return this.author.id;
  },
},

);


/*afterCreate(post, server) {
    post.update({
      author: server.create('user')
    });
  },*/
