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
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.item.id = data.payload.id;
        this.item.displayName = data.payload.data().displayName;
        this.item.email = data.payload.data().email;
        this.item.password = data.payload.data().password;
        this.item.complaints = data.payload.data().complaints;
        this.item.accountType = data.payload.data().accountType;
        this.item.phoneNumber = data.payload.data().phoneNumber;
        this.item.startDate = data.payload.data().startDate;

        console.log("data: ", data.payload.data());

        console.log("edituser.ts= ngOnInit() this.item: ", this.item.id);
        console.log("edituser.ts= ngOnInit() this.item:2 ", this.item.displayName);
        console.log("edituser.ts= ngOnInit() this.item:3 ", this.item.email);
        console.log("edituser.ts= ngOnInit() this.item:4 ", this.item.accountType);
        this.createForm();
      }
    })
  }

  

  createForm() {
    this.exampleForm = this.fb.group({
      displayName: [this.item.displayName, Validators.required],
      email: [this.item.email, Validators.required],
      password: [this.item.password, Validators.required],
      accountType: [this.item.accountType, Validators.required],
      phoneNumber: [this.item.phoneNumber, Validators.required],
      startDate: [this.item.startDate, Validators.required],
      complaints: [this.item.complaints],
    });
  }


  onSubmit(value){
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.router.navigate(['/user-list']);
      }
    )
    console.log("edituser.ts=> this.item.id: ");
    console.log('userKey: ' + this.item.id);
  }

  cancel(){
    this.router.navigate(['/user-list']);
  }

}
