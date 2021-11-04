import Model, { attr} from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') title;
  @attr('string') body;
  @attr publishedAt;
  @attr image;
  @attr('number') authorId;
  @attr('boolean', { defaultValue: true }) isActive;
  @attr tag;
  @attr author;
}
