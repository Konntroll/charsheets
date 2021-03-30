import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  email: string,
  displayName: string,
  uid: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user$: Observable<User>;
  id: string;
  loggedIn: boolean = false;
  errorMessage = new BehaviorSubject<string>("");
  errorMessage$ = this.errorMessage.asObservable();

  constructor (
    private appAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    
    this.user$ = this.appAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  async signup(email: string, password: string, name: string) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(
      (cred) => {
          this.loggedIn = true;
          this.router.navigate(['public']);
          this.updateUserData(cred.user, name);
      }
    ).catch(error => {
      this.errorMessage.next(error.message);
   });
  }

  async signin(email, password) {
    await this.appAuth.signInWithEmailAndPassword(email, password).then(
      (cred) => {
        this.id = cred.user.uid;
        this.loggedIn = true;
        this.router.navigate(['private']);
      }
    ).catch(error => {
      this.errorMessage.next(error.message);
   });
  }

  async signout(router: Router = this.router) {
    let signedin: boolean = true;
    await firebase.auth().signOut().then(function() {
      router.navigate(['public']);
      signedin = false;
      console.log("Logged out!");
    }, function(error) {
        console.log(error.code);
        console.log(error.message);
    });
    if (!signedin) {
      this.loggedIn = false;
    }
  }

  updateUserData(user: User, name: string){
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: name
    }
    return userRef.set(data, {merge: true});
  }
}
