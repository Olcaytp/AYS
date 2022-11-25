import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  ageValue: number = 0;
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  email_filtered_items: Array<any>;

  user: Observable<any>;              // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(
    private afAuth: AngularFireAuth,
    public firebaseService: FirebaseService,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.user = null;
   }

  ngOnInit() {
    this.getData();

    this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.firestore.collection('users').doc(emailLower).valueChanges(); // get the user's doc in Cloud Firestore
      }
  });
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

  viewDetails(item){
    this.router.navigate(['../../details'+ item.payload.doc.id]);
    console.log('UserListComponent: viewDetails: item', item.payload.doc.id);

    this.afAuth.authState.subscribe(user => {
      console.log('Dashboard: user', user);

      if (user) {
          let emailLower = user.email.toLowerCase();
          this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
          console.log('user is logged in');
          console.log("this is user.uid = " + user.uid);
          console.log("-----------------------");
      }
  });

  }

  capitalizeFirstLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName(){
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchUsers(value)
    .subscribe(result => {
      this.name_filtered_items = result;
      this.items = this.combineLists(result, this.email_filtered_items);
    })
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

}
