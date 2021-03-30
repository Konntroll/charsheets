import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TraitComponent } from './components/trait/trait.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { DiceComponent } from './components/dice/dice.component';
import { DataService } from './services/data.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PublicComponent } from './components/public/public.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { PrivateComponent } from './components/private/private.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    TraitComponent,
    SheetComponent,
    DiceComponent,
    NavbarComponent,
    PublicComponent,
    SignupComponent,
    SigninComponent,
    PrivateComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
