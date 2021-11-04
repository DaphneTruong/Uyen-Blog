import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service session;
  get posts() {
    return this.model.slice(0, 3);
  }

}
