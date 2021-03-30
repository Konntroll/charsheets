import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from "firebase/app";
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  doc: AngularFirestoreDocument;
  data: Observable<any>;

  constructor(public db: AngularFirestore,
              public loginService: LoginService,
              public router: Router) {}

  updateTrait(path, value) {
    this.doc.update({[path]: value});
  }

  removeTrait(path) {
    this.doc.update({[path]: firebase.firestore.FieldValue.delete()});
  }

  copyBlankSheet() {
    this.data = this.db
                .collection('chars')
                .doc('blank')
                .valueChanges().pipe(shareReplay(1));
    this.data.pipe(take(1)).subscribe(data => {
      this.db.collection('chars').add(data).then((docRef) => {
        this.loginService.user$.pipe(take(1)).subscribe(user => {
          let newDoc = this.db.collection('chars').doc(docRef.id);
          newDoc.update({'author': user.uid});
          newDoc.update({'charID': docRef.id});
        });
        this.switchToNewSheet(docRef.id);
      });
    });
  }
  
  switchToNewSheet(ID: string) {
    console.log('DATA ID: ' + ID);
    this.doc = this.db.collection('chars').doc(ID);
    this.data = this.db
              .collection('chars')
              .doc(ID)
              .valueChanges().pipe(shareReplay(1));
    this.router.navigate(['new']);
  }

  getPublicChars() {
    var publicChars = this.db.collection('chars', ref => {return ref.where("published", "==", true)});
    return publicChars.valueChanges();
  }

  getPrivateChars(uid: string) {
    var privateChars = this.db.collection('chars', ref => {return ref.where("author", "==", uid)});
    return privateChars.valueChanges();
  }

  refinePrivateSelection(path: string, query: string) {
    if (path !== "Name") {
      path = 'meta.' + path;
    }
    var refinedChars = this.db.collection('chars', ref => {return ref.where(path, "==", query)});
    return refinedChars.valueChanges();
  }

  refinePublicSelection(path: string, query: string) {
    if (path !== "Name") {
      path = 'meta.' + path;
    }
    var refinedChars = this.db.collection('chars', ref => {return ref.where(path, "==", query)
                                                                     .where("published", "==", true)});
    return refinedChars.valueChanges();
  }

  getPics(tag: string) {
    var pics = this.db.collection('pics', ref => {return ref.where("tags", "array-contains", tag)});
    return pics.valueChanges();
  }
}