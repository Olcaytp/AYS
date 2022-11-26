import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  user: Observable<any>; 
  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
    )  { }

    ngOnInit(): void {
      this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
          if (user) {
              let emailLower = user.email.toLowerCase();
              this.user = this.firestore.collection('users').doc(emailLower).valueChanges(); // get the user's doc in Cloud Firestore
          }
      });
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
