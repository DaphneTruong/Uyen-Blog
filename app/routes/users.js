import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UsersRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('user');
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('userName', '');
    controller.set('userEmail', '');
    controller.set('birthday', '');
    controller.set('userPwd', '');
    controller.set('repwd', '');
  }
}
