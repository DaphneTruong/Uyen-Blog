import faker from 'faker';

export default function (server) {
  server.loadFixtures('users');
  server.createList('post', 20);
  server.db.loadData({
    posts: [
      {
        id: 101,
        title: 'Tomato Joke',

        body: 'Why did the tomato blush? Because he saw the salad dressing.',

        tag: 'foods',

        publishedAt() {
          return faker.date.past();
        },
        image: 'https://fatbottomfiftiesgetfierce.files.wordpress.com/2014/09/friday-five-tomato.jpg',
        isAactive: true,
        author: { id: 1, firstname: 'Bruno', lastname: 'Michaelis', email: 'bruno.michaelis@icgroupinc.com', date: '06/18/1980', isAdmin: true, password: '1234', blogname: 'Funny Things'  },
      },
      {
        id: 102,
        title: 'I am a superman',

        body: 'If you ask me how can I have 3 jobs and still enjoy my life, well because I am a superman!',
        tag: 'minimalism',
        publishedAt() {
          return faker.date.past();
        },
        image: 'https://placeimg.com/640/480/nature',
        isAactive: true,
        author: { id: 2, firstname: 'Brandyn', lastname: 'Sparks', email: 'brandyn.sparks@icgroupinc.com', date: '10/25/1993', isAdmin: true, password: '1234', blogname: 'My Diary' },
      },
    ]
  });
  server.createList('user',1);

  /*let author = server.create('user');
  server.createList('post', 10, { author });*/

  

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  // server.createList('post', 10);
}
