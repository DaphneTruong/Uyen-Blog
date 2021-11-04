import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked errorMessage;
  @service session;
  @service router;

  @action
  async authenticate(e) {
    e.preventDefault();
    let { userEmail, pwd } = this;
    try {
      await this.session.authenticate('authenticator:oauth2', userEmail, pwd);
    } catch (errors) {
      this.errorMessage = errors.responseJSON.errors.error;
    }
    if (this.session.isAuthenticated) {
      this.router.transitionTo('posts');
    }
  }
}

