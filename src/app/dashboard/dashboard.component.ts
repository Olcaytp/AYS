import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import Complaint from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    complaint: Complaint = new Complaint();
    user: Observable<any>;              // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

    constructor(
        private afAuth: AngularFireAuth,
        private firestore: AngularFirestore,
        private router: Router,
        public ComplaintService: ComplaintService,
        public translateService: TranslateService
        ) 
        {
        this.user = null;
    }

    ngOnInit(): void {
        this.afAuth.authState.subscribe(user => {
            console.log('Dashboard: user', user);

            if (user) {
                this.user = this.firestore.collection('users').doc(user.uid).valueChanges();
                console.log('user is logged in');
                console.log("this is user.uid = " + user.uid);
            }
        });
    }

    public changeLanguage(language: string): void {
        this.translateService.use(language);
      }

    saveComplaint(): void {
        this.ComplaintService.create(this.complaint).then(() => {
          console.log('Created new item successfully!');
          this.router.navigate(['/complaints']);
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
