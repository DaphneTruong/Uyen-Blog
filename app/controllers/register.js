import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { match } from '@ember/object/computed';

//RegExp for validation of form fields
class User {
  @match('email', /^[A-z0-9]{1,}[._-]*[A-z0-9]{1,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,4}$/) hasValidEmail;
  @match('name', /^([^0-9]){2,20}$/) hasValidName;
  @match('pwd', /^(?=(.*[A-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,}).{8,}$/) hasValidPwd;
}

export default class UsersController extends Controller {
  @service session;
  @service store;

  @tracked errors = {};
  @tracked firstnameError;
  @tracked lastnameError;
  @tracked emailError;
  @tracked dateError;
  @tracked pwdError;
  @tracked errorNotice;

  @tracked notice;

  @action
  checkInputText(field, e) {
    let errorName = field.concat('Error');
    if (this[field]) {
      let value = (e.target.value).trim();
      if (value) {
        let user = new User();
        set(user, 'name', e.target.value);
        if (!user.hasValidName) {
          this.errors[field] = `Your ${field} can not include a number! or longer than 20 letters`;
        } else {
          delete this.errors[field];
        }
      } else {
        this.errors[field] = `Your ${field} can not be empty`;
      }
      
      this[errorName] = this.errors[field];
    }
  }

  @action
  checkInputEmail(e) {
    let user = new User();
    let value = e.target.value;
    set(user, 'email', e.target.value);

    let existingUser = this.model.findBy('email', value.trim());
    if (existingUser) {
      this.errors.email = 'This email has been used!';
    } else {
      if (!user.hasValidEmail) {
        this.errors.email = 'Your email is in valid';
      } else {
        delete this.errors.email;
      }
    }
    this.emailError = this.errors.email;
  }

  @action
  checkDate(e) {
    let value = e.target.value;
    if (value) {
      let currentYear = new Date().getFullYear();
      let year = value.slice(0, value.length - 6);
      let age = currentYear - parseInt(year);

      if (age < 10) {
        this.errors.date = "You are too young for this page, babe!";
      } else {
        delete this.errors.date;
      }
    } 
      this.dateError = this.errors.date;
  }

  @action
  checkInputPassword(e) {
    let user = new User();
    set(user, 'pwd', e.target.value);
    if (e.target.value.length < 8) {
      this.errors.password = 'Your password must be at least 8 characters';
    } else {
      if (!user.hasValidPwd) {
        this.errors.password = 'Make sure your password has:  At least one letter; At least one digit; At least one special character';
      } else {
        delete this.errors.password;
      }
    }
    
    this.pwdError = this.errors.password;
  }

  @action
  async createUser(e) {
    event.preventDefault();
    //make sure password and re-enter password are identical
    if (this.userPwd === this.repwd) {
      delete this.errors.errorNotice;
      this.errorNotice = '';
      let attrs = {
        firstname: (this.firstname).trim(),
        lastname: (this.lastname).trim(),
        email: (this.userEmail).trim(),
        date: (this.birthday).trim(),
        isAdmin: false,
        password: encodeURIComponent(this.userPwd),
      }
      //check empty input

      for (let attr in attrs) {
        if (!attrs[attr] && attr != 'isAdmin') {
          this.errors[attr] = `Your ${attr} can not be empty`;
        }
      }
      //tracked variable to show on view
      this.firstnameError = this.errors.firstname;
      this.lastnameError = this.errors.lastname;
      this.emailError = this.errors.email;
      this.dateError = this.errors.date;
      this.pwdError = this.errors.password;
      //create new user if there is no error
      if (Object.keys(this.errors).length == 0) {
        let user = this.store.createRecord('user', attrs);
        try {
          await user.save();
        } catch (errors) {
          this.errorNotice = this.errors.errorNotice = errors;
        }
        
        this.notice = 'Your account has been created. Please login to write a blog!'
      }

    } else {
      this.errorNotice = this.errors.errorNotice = 'Re-entered Password must match with your Password, dude!';
    }
  }

  
}
