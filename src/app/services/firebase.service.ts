import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getUser(userKey){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  updateUser(userKey, value){
    value.nameToSearch = value.displayName.toLowerCase();
    console.log("value1: " + value.nameToSearch);
    return this.db.collection('users').doc(userKey).set(value);
  }

  deleteUser(userKey){
    return this.db.collection('users').doc(userKey).delete();
  }

  getUsers(){
    return this.db.collection('users').snapshotChanges();
  }

  searchUsers(searchValue){
    return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }

  searchUsersByAge(value){
    return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }

  searchUsersByID(value){
    return this.db.collection('users',ref => ref.where('uid', '==', value)).snapshotChanges();
  }

  createUser(value){
    return this.db.collection('users').add({
      name: value.name,
      surname: value.surname,
      age: parseInt(value.age),
      email: value.email,
      password: value.password,
      uid: value.uid,
      phone: value.phone,
      date: value.date,
    });
  }
}
