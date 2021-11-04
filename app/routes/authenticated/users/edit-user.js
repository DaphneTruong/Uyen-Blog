import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AuthenticatedAdminEditUserRoute extends Route {
  @service store;
  @service session;

  model(params) {
    return this.store.findRecord('user', params.id)
  }

  beforeModel(transition) {
    if (!this.session.data.authenticated.user.isAdmin) {
      this.transitionTo('index');
    }
    let editUserController = this.controllerFor('authenticated.users.editUser');
    editUserController.previousTransition = transition.from;
    //when user at the edit user page and refresh the page.
    if (editUserController.previousTransition == null) {
      editUserController.previousTransition = { name: 'authenticated.users' };
    }
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
