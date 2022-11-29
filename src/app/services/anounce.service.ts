import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "@angular/fire/compat/firestore";

import Anounce from "../models/anounce";

@Injectable({
    providedIn: 'root'
  })
  export class AnounceService {
    private dbPath = '/anounces';
  
    anouncesRef: AngularFirestoreCollection<Anounce>;
  
    constructor(private db: AngularFirestore) {
      this.anouncesRef = db.collection(this.dbPath);
    }

    getAll(): AngularFirestoreCollection<Anounce> {
        return this.anouncesRef;
      }
    
      create(anounce: Anounce): any {
        return this.anouncesRef.add({ ...anounce });
      }
    
      update(id: string, data: any): Promise<void> {
        return this.anouncesRef.doc(id).update(data);
      }
    
      delete(id: string): Promise<void> {
        return this.anouncesRef.doc(id).delete();
      }
    }
    