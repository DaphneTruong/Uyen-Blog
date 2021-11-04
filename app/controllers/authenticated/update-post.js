import Controller from '@ember/controller';
import { action,set} from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { match } from '@ember/object/computed';

//RegExp for validation of url
class Link {
  @match('url', /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?()[.]{1}[A-z0-9]{1,}(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?()$/) hasValidUrl;
}

export default class UpdatePostController extends Controller {
  @service router;
  @tracked errors;
  @tracked emptyFields = {};
  @tracked emptybody;
  @tracked emptytitle;
  @tracked emptyimage;

  @tracked isShowingModal = false;
  @tracked transitionPath;

  @tracked imageUrl = this.model.image;

  @action
  validInput(field, event) {
    this.model.image = this.imageUrl;
    if (!event.target.value.trim()) {
      this[`empty${field}`] = this.emptyFields[field] = `Your post ${field} can not be empty`;
    } else {
      this[`empty${field}`] = '';
      delete this.emptyFields[field];
      
      if (field == 'image') {
        let url = new Link();
        set(url, 'url', (event.target.value).trim());
        if (!url.hasValidUrl) {
          this.errors = 'Your link is not valid.';
        } else {
          this.errors = '';
        }
      } 
    }
  }

  @action
  async rollBack(event) {
    event.preventDefault();
    this.toggleModal();
    try {
      await this.model.rollbackAttributes();
    } catch (errors) {
      this.errors = errors
    }
    let previousTransition = this.previousTransition;
    if (this.previousTransition) {
      this.previousTransition = null;
      previousTransition.retry();
    }
    
  }

  @action
  async updatePost(event) {
    event.preventDefault();

    if (Object.keys(this.emptyFields).length === 0 && !this.errors) {
      try {
        await this.model.save();
      } catch (errors) {
        this.errors = errors;
      }
      this.imageUrl = this.model.image;
      this.router.transitionTo('post', this.model.id);
    }
  }

  @action
  toggleModal() {
    this.toggleProperty('isShowingModal');
  }
}
