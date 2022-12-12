import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import {
  addDoc,
  Firestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore'
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  searchText: string = "";
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  email_filtered_items: Array<any>;
  age_filtered_items: Array<any>;

  user: Observable<any>;              // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(
    private afAuth: AngularFireAuth,
    public firebaseService: FirebaseService,
    private router: Router,
    private firestore: AngularFirestore,
    public translateService: TranslateService
  ) {
    this.user = null;
   }

  ngOnInit() {
    this.getData();
    const dataSource = this.items;
    this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
      }
  });
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }

  getData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
      this.name_filtered_items = result;
      this.email_filtered_items = result;
      this.age_filtered_items = result;
      console.log('UserListComponent: items', this.items.length);
    })
  }

  deleteuser(item){
    this.firebaseService.deleteUser(item.payload.doc.id);
  };

  viewDetails(item){
    this.router.navigate(['/details/' + item.payload.doc.id]);
    console.log("item.payload.doc.id"); //  same as edituser.t=> this.item.id:
    console.log(item.payload.doc.id);
    console.log(item.payload.doc.data());
    console.log(item.payload.doc.data().displayName);
    console.log(item.payload.doc);
  }

  capitalizeFirstLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  combineLists(a, b){
    let result = [];

    a.filter(x => {
      return b.filter(x2 =>{
        if(x2.payload.doc.id == x.payload.doc.id){
          result.push(x2);
        }
      });
    });
    return result;
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
