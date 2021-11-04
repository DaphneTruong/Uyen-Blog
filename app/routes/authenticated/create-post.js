import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CreatePostRoute extends Route {
  @service session;
  @service store;

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('title', '');
    controller.set('body', '');
    controller.set('inputImg', '');
    controller.set('tag', '');
  }
}
