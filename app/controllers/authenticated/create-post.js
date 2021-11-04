import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { match } from '@ember/object/computed';
import { DateTime } from "luxon";
//RegExp for validation of url
class Link {
  @match('url', /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?()[.]{1}[A-z0-9]{1,}(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?()$/) hasValidUrl;
}

export default class CreatePostController extends Controller {
  @service session;
  @service router;
  @service store;
  @tracked tag;
  @tracked publishDate = DateTime.now().setZone('system');
  @tracked error;
  @tracked saveErrors;
  @tracked errorFields = {};
  @tracked errorBody;
  @tracked errorTitle;
  @tracked errorTag;
  @tracked errorImage;
  @tracked errorUrl;
  @tracked tag;

  @action
  createPost(event) {
    event.preventDefault();
    this.publishDate = this.publishDate.toLocaleString(DateTime.DATETIME_FULL);

    let requiredFields = { Title: this.title.trim(), Body: this.body.trim(), Tag: this.tag, Image: this.inputImg.trim()};

    //check empty input
    for (let field in requiredFields) {
      if (!requiredFields[field]) {
        this[`error${field}`] = this.errorFields[field] = `Your ${field} can not be empty`;
      } else{
        this[`error${field}`] = '';
        delete this.errorFields[field];
      }
    }
    //save a post model
    if (Object.keys(this.errorFields).length === 0) {
      let post = this.store.createRecord('post', {
        title: this.title,
        body: this.body,
        image: this.inputImg,
        isAllowed: true,
        publishedAt: this.publishDate,
        author: this.session.data.authenticated.user,
        tag: this.tag,
      });
      this.savePost(post);
    }
  }
  @action
  inputValue(field, e) {
    let value = this[field] =  (e.target.value).trim();

    if (field == 'image') {
      if (value) {
        let url = new Link();
        set(url, 'url', value.trim());
        if (!url.hasValidUrl) {
          this.errorUrl = this.errorFields.Url = 'Your link is not valid.';
        } else {
          this.errorUrl = '';
          delete this.errorFields.Url;
        }
      }
    }

    if (field == 'tag') {
      this.tag = e.target.value;
    }
  }

  @action
  async savePost(post) {
      try {
        await post.save();
      } catch (error) {
        this.saveErrors = error;
      }
      this.router.transitionTo('post', post.id);
  }

}
