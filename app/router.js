import EmberRouter from '@ember/routing/router';
import config from 'ember-blog/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('posts');
  this.route('post', { path: 'posts/:post_id' });
  this.route('login');
  this.route('register');
  this.route('authenticated', { path: '/' }, function () {
    //routes for posts
    this.route('createPost');
    this.route('updatePost', { path: '/updatePost/:post_id' });

    //Routes for admins
    this.route('users', function () {
      this.route('editUser', {path:'edit/:id'});
    });

    //Route for authenticated users
    this.route('profile');
    this.route('editProfile', { path: 'editProfile/:id' });
  });

  this.route('not-found', { path: '/*path' });

  this.route('index', { path: '' });
});
