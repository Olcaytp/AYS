import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  user: Observable<any>; 

  signupForm: FormGroup;
  isProgressVisible: boolean;
  firebaseErrorMessage: string;
  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

    constructor(
        private afAuth: AngularFireAuth, 
        private router: Router, 
        private firestore: AngularFirestore, 
        private authService: AuthService 
        ) {
        this.user = null;
    }

    ngOnInit(): void {
        this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
            if (user) {
                let emailLower = user.email.toLowerCase();
                this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
            }
        });

        this.signupForm = new FormGroup({
            'displayName': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required),
            'phoneNumber': new FormControl('', Validators.required),
            'confirmPassword': new FormControl('', Validators.required),
            'startDate': new FormControl('', Validators.required),
        });
    }

    signup() {
        if (this.signupForm.invalid)                            // if there's an error in the form, don't submit it
            return;

        this.isProgressVisible = true;
        this.authService.signupUser(this.signupForm.value).then((result) => {
            if (result == null)                                 // null is success, false means there was an error
                this.router.navigate(['/dashboard']);            // navigate to dashboard
            else if (result.isValid == false)
                this.firebaseErrorMessage = result.message;

            this.isProgressVisible = false;                     // no matter what, when the auth service returns, we hide the progress indicator
        }).catch(() => {
            this.isProgressVisible = false;
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
