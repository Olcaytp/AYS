import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  exampleForm: FormGroup;
  item: any;
  ageValue: number = 0;
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  email_filtered_items: Array<any>;

  validation_messages = {
   'name': [
     { type: 'required', message: 'Name is required.' }
   ],
   'surname': [
     { type: 'required', message: 'Surname is required.' }
   ],
   'age': [
     { type: 'required', message: 'Age is required.' },
   ],
    'email': [
      { type: 'required', message: 'Email is required.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
    ]
 };

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) { }

  getData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
      this.name_filtered_items = result;
      this.email_filtered_items = result;
      console.log('UserListComponent: items', this.items.length);
    })
  }

  ngOnInit() {
    console.log("edituser.ts= ngOnInit()", this.route.snapshot.params['id']);
    this.route.data.subscribe(routeData => {
      let data = routeData['id'];
      if (data) {
        this.item = data;
        this.item.id = data.payload.id;
        console.log("edituser.ts= ngOnInit() this.item: ", this.item);
        console.log("edituser.ts= ngOnInit() this.item:2 ", this.item.id);
        console.log("edituser.ts= ngOnInit() this.item:3 ", this.item.name);
        console.log("edituser.ts= ngOnInit() this.item:4 ", this.item.surname);
        this.createForm();
      }
    })
  }

  

  createForm() {
    this.exampleForm = this.fb.group({
      name: [this.item.name, Validators.required],
      surname: [this.item.surname, Validators.required],
      age: [this.item.age, Validators.required],
      email: [this.item.email, Validators.required],
      password: [this.item.password, Validators.required],
      complaints: [this.item.complaints],
    });
  }


  onSubmit(value){
    value.age = Number(value.age);
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.router.navigate(['/user-list']);
      }
    )
    console.log("edituser.ts=> this.item.id: ");
    console.log('userKey: ' + this.item.id);
  }

  delete(){
    this.firebaseService.deleteUser(this.item.id)
    .then(
      res => {
        this.router.navigate(['/user-list']);
      },
      err => {
        console.log(err);
      }
    )
  }

  cancel(){
    this.router.navigate(['/user-list']);
  }

}







/**
export class EditUserComponent implements OnInit {

  exampleForm: FormGroup;
  item: any;
  user: Observable<any>; 
  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'surname': [
      { type: 'required', message: 'Surname is required.' }
    ],
    'age': [
      { type: 'required', message: 'Age is required.' },
    ],
     'email': [
       { type: 'required', message: 'Email is required.' },
     ],
     'password': [
       { type: 'required', message: 'Password is required.' },
     ]
  };

    constructor(
      public firebaseService: FirebaseService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      public dialog: MatDialog,
        private afAuth: AngularFireAuth,
        private firestore: AngularFirestore,
        private router: Router,
        ) {
        this.user = null;
    }


    ngOnInit(): void {
      this.afAuth.authState.subscribe(user => {               // grab the user object from Firebase Authorization
          if (user) {
              let emailLower = user.email.toLowerCase();
              this.user = this.firestore.collection('users').doc(emailLower).valueChanges(); // get the user's doc in Cloud Firestore
          }
      });
      console.log('user', this.user);

      this.afAuth.authState.subscribe(routeData => {
        let data = routeData['data'];
        if (data) {
          this.item = data.payload.data();
          this.item.id = this.firestore.collection('users').doc(this.item.email);
          this.createForm();
        }
      })
      console.log('user2', this.user);
      // console.log("edituser.ts=>" +  this.item.id); // not working
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: [this.item.name, Validators.required],
      surname: [this.item.surname, Validators.required],
      age: [this.item.age, Validators.required],
      email: [this.item.email, Validators.required],
      password: [this.item.password, Validators.required],
      complaints: [this.item.complaints],
    });
  }

  onSubmit(value){
    value.age = Number(value.age);
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.router.navigate(['/home']);
      }
    )
    console.log("edituser.ts=> this.item.id: ");
    console.log('userKey: ' + this.item.id);
  }

  delete(){
    this.firebaseService.deleteUser(this.item.id)
    .then(
      res => {
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    )
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

cancel(){
  this.router.navigate(['/home']);
}

}


}
*/