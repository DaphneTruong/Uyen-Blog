import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthenticatedUserListRoute extends Route {
  @service store;
  @service session;

  model() {
    return this.store.findAll('user');
  }

  beforeModel(transition) {
    if (!this.session.data.authenticated.user.isAdmin) {
      this.transitionTo('index');
    }
  }
}
