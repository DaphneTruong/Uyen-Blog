import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') firstname;
  @attr('string') lastname;
  @attr('string') email;
  @attr date;
  @attr password;
  @attr('boolean', { default: false }) isAdmin;
  @hasMany('post') posts;
}
