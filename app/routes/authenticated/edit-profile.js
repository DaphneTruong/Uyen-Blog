import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AuthenticatedUpdateUserRoute extends Route {
  @service session;
  @service store;

  model(params) {
    return this.store.findRecord('user', params.id);
  }

  @action
  willTransition(transition) {
    this.controller.previousTransition = transition;
    if (this.currentModel.hasDirtyAttributes) {
      transition.abort();
      this.controller.toggleModal();
    }
  }


  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('firstnameError', '');
    controller.set('lastnameError', '');
    controller.set('emailError', '');
    controller.set('birthdayError', '');
    controller.set('passwordError', '');
    controller.set('rePwd', '');
    controller.set('rePwdError', '');
    controller.set('errors', {});
    controller.set('editPassword', false);

  }
}
