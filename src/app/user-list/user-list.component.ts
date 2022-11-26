import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
