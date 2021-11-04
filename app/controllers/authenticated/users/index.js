import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AuthenticatedUserListController extends Controller {
  @service session;

  @tracked user;
  @tracked isShowingModal = false;
  @tracked errors;

  @action
  async deleteUser(user) {
    try {
      await user.destroyRecord();
    } catch(errors) {
      this.errors = errors
    }
    this.toggleModal();
    if (this.session.data.authenticated.user.id == user.id) {
      this.session.invalidate();
    }
  }

  @action
  toggleModal() {
     this.toggleProperty('isShowingModal');
  }

  @action
  showModal(user) {
    this.user = user;
    this.toggleModal();
  }
}
