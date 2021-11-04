import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PostRoute extends Route {
  @service session;
  @service store;
  @service router;

  model(params) {
    return this.store.findRecord('post', params.post_id);
  }

  @action
  error(reason) {
    //this function to return user to posts page when they enter invalid post_id to the url
    this.router.transitionTo('posts');
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    if (this.session.isAuthenticated) {
      let user = this.session.data.authenticated.user;
      if (!controller.notExist) {
        let userEmail = model.author.email;

        controller.set('isAdmin', user.isAdmin);

        //check author role of authenticated user
        if (userEmail == user.email) {
          controller.set('isAuthor', true);
        } else {
          controller.set('isAuthor', false);
        }
      }
    }
  }

  
}
