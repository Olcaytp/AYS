import { Component, OnInit } from '@angular/core';

import { AnounceService } from '../services/anounce.service';
import Anounce from '../models/anounce';
import { map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-anounces',
  templateUrl: './anounces.component.html',
  styleUrls: ['./anounces.component.css']
})
export class AnouncesComponent implements OnInit {

  anounces?: Anounce[];
  currentAnounce?: Anounce;
  currentIndex = -1;
  title = '';
  user: Observable<any>;
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  email_filtered_items: Array<any>;
  
  constructor(
    private AnounceService: AnounceService,
    public firebaseService: FirebaseService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    ) {
      this.user = null;
     }

  ngOnInit(): void {
    this.getData();
    const dataSource = this.items;
    this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
      }
  });
    this.retrieveTutorials();
  }

  getData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
      this.name_filtered_items = result;
      this.email_filtered_items = result;
      console.log('UserListComponent: items', this.items.length);
    })
  }

  refreshList(): void {
    this.currentAnounce = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.AnounceService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.anounces = data;
    });
  }

  setActiveAnounce(anounce: Anounce, index: number): void {
    this.currentAnounce = anounce;
    this.currentIndex = index;
  }

  logout(): void {
    this.afAuth.signOut()
    .then(() => {
        this.router.navigate(['/login']);                    // when we log the user out, navigate them to home
    })
    .catch(error => {
        console.log('Auth Service: logout error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code)
            return error;
    });
}

}
