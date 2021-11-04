import Response from 'ember-cli-mirage/response';

export default function () {
  this.get('/posts');

  this.get('/', (schema) => {
    return schema.posts.all();
  });

  this.get('/posts/:post_id', (schema, request) => {
    return schema.posts.find(request.params.post_id);
    
  });

  this.post('/posts');

  this.patch('/posts/:id');

  this.del('/posts/:id');


  /*-----------------------User CRUD -----------------------*/
  this.get('/users/:id');

  this.get('/users');

  this.post('/users');

  this.post('/token', (schema, request) => {
    //split the string from requestBody
    let data = request.requestBody.replace('grant_type=password&username=', '');
    let dataArr = data.split('&');

    //get email and password from the input
    let email = dataArr[0].replace('%40', '@');
    let password = dataArr[1].replace('password=', '');
    let user = schema.users.findBy({ email: email, password: password });
    if (!user || !email || !password) {
      return new Response(422,
        { 'Content-Type': 'application/json' },
        {
          errors:
            { error: 'Your ID is not correct, you\'re not alive' },
        }
      );
    } else {
      return new Response(
        200,
        {},//header will be stored here
        {
          access_token: '123456',
          email: email,
          user: schema.users.findBy({ email: email }),
        }
      );
    }
  });


  this.patch('/users/:id');
  this.del('/users/:id');

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*     
      https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */
}
