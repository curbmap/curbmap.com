import { Component, Inject, OnInit } from '@angular/core';
import { NavInformation } from '../shared/nav-information.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sendPost } from '../shared/http.resources';
import { Http, Response } from '@angular/http';
import { hasSpecial, hasNumber, hasCapital, hasLowercase } from '../shared/validators';
import { Router } from '@angular/router';
let frontend: string = location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://curbmap.com:443';
import * as $ from 'jquery';

@Component({
  selector: 'my-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  signupFormErrors = {
    'username': '',
    'password': '',
    'email': ''
  };
  displayMissingInfo = false;
  MissingInfo = 'Some of your fields were missing information.';
  displayUsernameTakenInfo = false;
  UsernameTakenInfo = 'Sorry, that username is already taken.';
  displayEmailTakenInfo = false;
  EmailTakenInfo = 'Sorry, that email address is already used.';
  displayPasswordIncorrectInfo = false;
  PasswordIncorrectInfo = 'Please pay attention to the specific password requirements.';
  displayEmailIncorrectInfo = false;
  EmailIncorrectInfo = 'Please enter a valid email address.';

  validationMessages = {
    'username': {
      'required':      'Username is required.<br>',
      'minlength':     'Username must be at least 8 characters long.<br>',
      'maxlength':     'Username cannot be more than 16 characters long.<br>',
      'pattern':       'Username may only contain A-Z, a-z, \', or -<br>'
    },
    'password': {
      'required':      'Password is required.<br>',
      'minlength':     'Password must be at least 8 characters long.<br>',
      'maxlength':     'Password cannot be more than 16 characters long.<br>',
      'hasCapital':    'Password must contain at least one capital letter A-Z<br>',
      'hasLowercase':  'Password must contain at least one lowercase letter a-z<br>',
      'hasNumber':     'Password must contain at least one number 0-9<br>',
      'hasSpecial':    'Password must contain at least one: ~!@#$%^&*()-=+<>?<br>'
    },
    'email': {
      'required':      'Email is required<br>',
      'email':       'Email must be a valid something@something.something format<br>'
    }
  };

  constructor(private navInformation: NavInformation,
    @Inject(FormBuilder) fb: FormBuilder,
    private http: Http,
    private router: Router) {
      // Do stuff
      this.navInformation.setNavLinks('Signup');
      this.signupForm = fb.group({
        username: ['', [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(64)]
        ],
        password: ['', [Validators.required,
          Validators.minLength(9),
          Validators.maxLength(64),
          hasCapital(),
          hasLowercase(),
          hasSpecial(),
          hasNumber()]
        ],
        email: ['', [Validators.required, Validators.email]]
      });
      this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));
      this.onValueChanged();
    }

    onSubmit() {
      console.log(this.signupForm.value);
      let headers = {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      };
      sendPost(this.http, headers, $.param(this.signupForm.value),
      frontend + '/signup',
      this.getSignupResponse, this.gotError).subscribe(signupResult => {
        console.log(parseInt(signupResult, 10));
        this.displayEmailTakenInfo = false;
        this.displayUsernameTakenInfo = false;
        this.displayPasswordIncorrectInfo = false;
        this.displayEmailIncorrectInfo = false;
        this.displayMissingInfo = false;
        switch (parseInt(signupResult, 10)) {
          case 1:
          this.router.navigate(['/'], {skipLocationChange: true}).then(result => {
            console.log(result);
          });
          break;
          case 0:
          this.displayMissingInfo = true;
          break;
          case -1:
          this.displayUsernameTakenInfo = true;
          break;
          case -2:
          this.displayEmailTakenInfo = true;
          break;
          case -3:
          this.displayPasswordIncorrectInfo = true;
          break;
          case -4:
          this.displayEmailIncorrectInfo = true;
          break;
          default:
          console.log('other error');
          break;
        }
      }
    );
  }

  getSignupResponse(r: Response) {
    return '' + r.json().success;
  }

  getToken(r: Response) {
    return r.text();
  }

  gotError(e: Response) {
    console.log('ERROR');
    console.log(e);
    return '-100';
  }

  onValueChanged(data?: any) {
    if (data == null) {
      console.log('No data, initialize');
    }
    if (!this.signupForm) { return; }
    const form = this.signupForm; // Stop the form from changing while checking values

    for (const field in this.signupFormErrors) {
      if (this.signupFormErrors.hasOwnProperty(field)) {
        this.signupFormErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.signupFormErrors[field] += messages[key] + ' <br> ';
            }
          }
        }
      }
    }
  }

  ngOnInit() {
  }

}
