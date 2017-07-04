import { Component, Inject, OnInit } from '@angular/core';
import { NavInformation } from '../shared/nav-information.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sendGet, sendPost } from '../shared/http.resources';
import { Http, Response } from '@angular/http';
import { UserInformation } from '../shared/user-information.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
let frontend: string = location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://curbmap.com:443';
// let backend: string = location.hostname == 'localhost' ? 'http://localhost:8081' : 'https://curbmap.com:50003';

@Component({
    selector: 'my-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginFormErrors = {
        'username': '',
        'password': ''
    };
    remember = false;
    validationMessages = {
        'username': {
            'required': 'Username is required',
            'minlength': 'Username must be at least 6 characters',
            'maxlength': 'Username must be less than 64 characters'
        },
        'password' : {
            'required': 'Password is required',
            'minlength': 'Password must be at least 9 characters',
            'maxlength': 'Password must be less than 64 characters'
        }
    };
    constructor(private navInformation: NavInformation,
                @Inject(FormBuilder) fb: FormBuilder,
                private http: Http, private router: Router, private userInformation: UserInformation) {
        // Do stuff
        this.navInformation.setNavLinks('Login');
        this.loginForm = fb.group({
            username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
            password: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(64)]],
            remember: [false]
        });
        this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onSubmit() {
        console.log(this.loginForm.value);
        sendGet(this.http, {}, '/token', this.getToken, this.gotError).subscribe(response => {
            console.log(response);
            let headers = { 'content-type': 'application/x-www-form-urlencoded', 'X-CSRF-TOKEN': response, 'withCredentials': true};
            sendPost(this.http,
              headers,
              $.param(this.loginForm.value),
              frontend + '/login',
              this.getLoginResponse,
              this.gotError).subscribe(loginResult => {
                    console.log(loginResult);
                    if (loginResult === 'true') {
                        this.userInformation.setCsrf(response);
                        this.userInformation.setUsername(this.loginForm.value.username);
                        this.userInformation.setPassword(this.loginForm.value.password);
                        this.router.navigate(['/in'], {skipLocationChange: true});
                    }
                }
            );
        });

    }
    getLoginResponse(r: Response) {
        if (r.url.toString().endsWith('error')) {
            return Observable.from(['false']);
        } else {
            return Observable.from(['true']);
        }
    }

    getToken(r: Response) {
        return r;
    }

    gotError(e: Response) {
        return e.statusText;
    }
    gotUser(r: Response) {
        console.log(r.json());
        return Observable.from(['true']);
    }
    gotNotLoggedIn(e: Response) {
        console.log('ERROR: ' + e);
        return Observable.from(['false']);
    }

    onValueChanged(data?: any) {
        if (data == null) {
            console.log('No data, initialize');
        } else {
            this.remember = data.remember;
        }
        if (!this.loginForm) { return; }
        const form = this.loginForm; // Stop the form from changing while checking values

        for (const field in this.loginFormErrors) {
            if (this.loginFormErrors.hasOwnProperty(field)) {
                this.loginFormErrors[field] = '';
                const control = form.get(field);
                if (control && control.dirty && !control.valid) {
                    const messages = this.validationMessages[field];
                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.loginFormErrors[field] += messages[key] + ' <br> ';
                        }
                    }
                }
            }
        }
    }
    ngOnInit() {
        sendGet(this.http,
          {},
          frontend + '/user',
          this.gotUser,
          this.gotNotLoggedIn).subscribe((getUser) => {
            console.log(getUser);
            if (getUser === 'true') {
                this.router.navigate(['/in'], {skipLocationChange: true});
            }
        });

    }

}
