import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { InComponent } from './in/in.component';
import { APIComponent}  from './API/API.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'about', component: AboutComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'in', component: InComponent },
    { path: 'API', component: APIComponent }
];

export const routing = RouterModule.forRoot(routes);
