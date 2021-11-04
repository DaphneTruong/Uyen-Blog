import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthenticatedUserRoute extends Route {
  @service session;
  @service store;

  model() {
    let user = this.session.data.authenticated.user;
    if (user) {
      return this.store.findRecord('user', user.id);
    }

  }
}
