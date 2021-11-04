import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class UpdatePostRoute extends Route {
  @service store;
  @service router;

  model(params) {
    return this.store.findRecord('post', params.post_id);
  }

  @action
  willTransition(transition) {
    this.controller.previousTransition = transition;
    if (this.currentModel.hasDirtyAttributes) {
      transition.abort();
      this.controller.toggleModal();
    }
  }

  @action
  error(reason) {
    this.router.transitionTo('posts');
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('emptybody','');
    controller.set('emptytitle', '');
    controller.set('emptyimage', '');
    controller.set('errors', '');
    controller.set('emptyFields', {});
    controller.set('imageUrl', model.image);
    if (controller.imageUrl == '/assets/imgs/brokeImgLink.png') {
      controller.set('imageUrl', 'Broken Link!');
    }
  }
  
}
