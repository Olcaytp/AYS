import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  emailSent: boolean;
  mobileValidator = new RegExp("(?:(?:\\+|0{0,2})91(\\s*[\\- ]\\s*)?|[0 ]?)?[789]\\d{9}|(\\d[ -]?){10}\\d", "g");
  user: Observable<any>; 

  constructor(
    public translateService: TranslateService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private service: ContactService,
    private router: Router,
    private afAuth: AngularFireAuth,
    ) {this.user = null; }
    
    ngOnInit(): void {
      this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
          if (user) {
              this.user = this.firestore.collection('users').doc(user.uid).valueChanges(); // get the user's doc in Cloud Firestore
          }
      });
    }

    contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(this.mobileValidator)]),
      city: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
      recieveCopy: new FormControl(false)
    })

    public changeLanguage(language: string): void {
      this.translateService.use(language);
    }

    onSubmit() {
      this.service.sendEmail(this.contactForm.value)
        .subscribe(res => {
          this.contactForm.reset();
          this.emailSent = true;
        },
          error => {
            console.log("TCL: ContactComponent -> onSubmit -> error", error);
          }
        );
    }
  
    resetForm() {
      this.emailSent = false;
      let nameField = document.querySelector('#name') as any;
      nameField.focus();
    }
  
    get formControls() {
      return this.contactForm.controls;
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
