import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import Payment from '../models/payment';
import { PaymentService } from '../services/payment.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  payments?: Payment[];
  currentIndex = -1;
  currentPayment?: Payment;
  title = '';
  user: Observable<any>;


  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private PaymentService: PaymentService,
    public translateService: TranslateService
    )  { }

    ngOnInit(): void {
      this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
          if (user) {
              let emailLower = user.email.toLowerCase();
              this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
          }
      });
      console.log('ngOnInit() is called' + this.payments);
      this.retrievePayments();
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }

  refreshList(): void {
    console.log('refreshList() is called' + this.payments);
    this.currentPayment = undefined;
    this.currentIndex = -1;
    this.retrievePayments();
  }

  retrievePayments(): void {
    console.log('retrievePayments() is called');
    this.PaymentService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.payments = data;
    });
  }

  setActivePayment(payment: Payment, index: number): void {
    this.currentPayment = payment;
    this.currentIndex = index;
    console.log('setActivePayments() is called' + this.currentPayment.title);
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
