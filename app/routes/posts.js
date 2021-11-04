import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PostsRoute extends Route {
  @service session;
  @service store;

  model() {
    return this.store.findAll('post');
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    let user = this.session.data.authenticated.user;
    if (user) {
      //check admin role of authenticated user
      controller.set('isAdmin', user.isAdmin);
    }
    controller.set('postsModel', model);
    
    controller.pagedContent.page = 1;
    controller.pagedContent.perPage = 5;
  }
}
  

