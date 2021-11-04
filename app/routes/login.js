import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.prohibitAuthentication('index');
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('errorMessage', '');
    controller.set('userEmail', '');
    controller.set('pwd', '');
  }
}
