import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { PublicComponent } from './components/public/public.component';
import { PrivateComponent } from './components/private/private.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AccessGuard } from './services/access.guard';

const routes: Routes = [
  {path: '', component: AboutComponent},
  {path: 'public', component: PublicComponent},
  {path: 'private', component: PrivateComponent, canActivate: [AccessGuard]},
  {path: 'new', component: SheetComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
