import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {

  }

  ngOnInit(): void {

  }
  
  logout(): void {
      this.afAuth.signOut();
  }


}
