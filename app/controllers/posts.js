import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, oneWay } from '@ember/object/computed';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default class PostsController extends Controller {
    
  @service session;
  @service router;
  @service store;

  @tracked isAdmin = false;
  @tracked isShowingModal = false;
  @tracked modelValue = '';
  @tracked post;
  @tracked errors;
  @tracked posts;
  @tracked authorFilter;
  @tracked tagFilter;

  @tracked postsModel = this.model;

  //PAGINATION
  queryParams = ["page", "perPage"];

  @tracked page = 1;
  @tracked perPage = 5;

  @pagedArray(
    'postsModel',
    {
      page: alias('parent.page'), perPage: alias('parent.perPage')
    }
  ) pagedContent;

  @oneWay('pagedContent.totalPages') totalPages;

  //filter by author
  @tracked users = this.store.findAll('user');

  @action filter(filter, event) {
    
    if (filter == 'author') {
      this.authorFilter = parseInt(event.target.value);
    }
    if (filter == 'tag') {
      this.tagFilter = event.target.value;
    }

    this.filterAction();
    
  }

  @action
  async deletePost(post) {
    try {
      await post.destroyRecord();
      this.postsModel = this.model;
    } catch (errors) {
      this.errors = errors;
    }
    this.filterAction();
    this.toggleModal();
  }

  @action
  filterAction() {
    if (this.authorFilter && this.tagFilter) {
      this.postsModel = this.model.filterBy('authorId', this.authorFilter).filterBy('tag', this.tagFilter);
    }

    if (this.authorFilter && !this.tagFilter) {
      this.postsModel = this.model.filterBy('authorId', this.authorFilter);
    }

    if (!this.authorFilter && this.tagFilter) {
      this.postsModel = this.model.filterBy('tag', this.tagFilter);
    }
    if (!this.authorFilter && !this.tagFilter) {
      this.postsModel = this.model;
    }

    this.pagedContent.page = 1;
  }

  @action
  toggleModal() {
    this.toggleProperty('isShowingModal');
  }

  @action
  showModal(post) {
    this.post = post;
    this.toggleModal();
  }
  
}
