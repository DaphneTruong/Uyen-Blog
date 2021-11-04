import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PostController extends Controller {
  @service session;
  @service router;

  @tracked isAdmin =false;
  @tracked isAuthor;
  @tracked errors;
  @tracked isShowingModal = false;
  @tracked post;

  @action
  showModal(post) {
    this.toggleModal();
    this.post = post;
  }

  @action
  toggleModal() {
    this.toggleProperty('isShowingModal');
  }

  @action
  async deletePost(post) {
    this.toggleModal();
    try {
      await post.destroyRecord();
    } catch (errors) {
      this.errors = errors;
    }
     this.router.transitionTo('/posts');
  }
}
