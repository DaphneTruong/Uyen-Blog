import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { match } from '@ember/object/computed';

//RegExp for validation of form fields
class User {
  @match('email', /^.+@.+\..+$/) hasValidEmail;
  @match('name', /^([^0-9]*)$/) hasValidName;
  @match('pwd', /^(?=(.*[A-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,}).{8,}$/) hasValidPwd;
}

export default class AuthenticatedUpdateUserController extends Controller {
  @service session;
  @service router;

  @tracked errors = {};
  @tracked firstnameError;
  @tracked lastnameError;
  @tracked emailError;
  @tracked passwordError;
  @tracked rePwdError
  @tracked birthdayError

  @tracked editPassword = false;

  @tracked isShowingModal = false;

  @action updateUserProperty(field, event) {
    let errorName = field.concat('Error');
    let firstCharacter = field.charAt(0).toUpperCase();
    let fieldName = firstCharacter + errorName.slice(1, field.length);

    if (!event.target.value.trim()) {
      this.errors[field] = this[errorName] = `${fieldName} can not be empty`
    } else {
      this[errorName] = '';
      delete this.errors[field];

      if (field === 'birthday') {
        let value = event.target.value;
        
        let currentYear = new Date().getFullYear();
        let year = value.slice(0, value.length - 6);
        let age = currentYear - parseInt(year);

        if (age < 10) {
          this.errors.birthday = "You are too young for this page, babe!";
        } else {
          delete this.errors.birthday;
        }
        
        this.birthdayError = this.errors.birthday;
      }

      let user = new User();

      if (field === 'firstname' || field === 'lastname') {
        set(user, 'name', event.target.value);
        if (!user.hasValidName) {
          this[errorName] = this.errors[field] = `Your ${field} can not include a number!`
        } else {
          this[errorName] = '';
          delete this.errors[field];
        }
      }

      if (field === 'email') {
        set(user, 'email', event.target.value);
        if (!user.hasValidEmail) {
          this.emailError = this.errors.email = 'Your email is in valid';
        } else {
          this.emailError = '';
          delete this.errors.email;
        }
      }

      if (field === 'password') {
        set(user, 'pwd', event.target.value);
        if (event.target.value.length < 8) {
          this.passwordError = this.errors.password = 'Your password must be at least 8 digits';
        } else {
          if (!user.hasValidPwd) {
            this.passwordError = this.errors.password = 'Make sure your password has:  At least one letter; At least one digit; At least one special character';
          } else {
            this.passwordError = '',
            delete this.errors.password;
          }
        }
      }

      if (field === "rePwd") {
        if (this.rePwd != decodeURIComponent(this.model.password)) {
          this.rePwdError = this.errors.rePwd = 'Your re-entered password must be same as your password';
        } else {
          this.rePwdError = '';
          delete this.errors.rePwd;
        }
      } 
    }
  }

  @action
  async editProfile(event) {
    event.preventDefault();

    if (this.editPassword) {
      if (this.rePwd != decodeURIComponent(this.model.password)) {
        this.rePwdError = this.errors.rePwd = 'Your re-entered password must be same as your password';
      } else {
        this.rePwdError = '';
        delete this.errors.rePwd;
      }
    } else {
      this.rePwdError = '';
      delete this.errors.rePwd;
    } 

    if (Object.keys(this.errors).length == 0) {
        this.model.password = encodeURIComponent(this.model.password);
      try {
        await this.model.save();
      } catch (errors) {
        this.errors.savingRecord = errors;
      }
      this.router.transitionTo('authenticated.profile');
    }

  }

  @action
  async rollBack() {
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
  editPasswordFnc() {
    this.rePwdError = '';
    this.passwordError = '';
    delete this.errors.rePwd;
    delete this.errors.password;
    if (this.model.changedAttributes().password) {
      this.model.rollbackAttributes('password');
    }
    this.editPassword = !this.editPassword;
  }

  @action
  toggleModal() {
    this.toggleProperty('isShowingModal');
  }
}
