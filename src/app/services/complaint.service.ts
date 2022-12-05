import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "@angular/fire/compat/firestore";

import Complaint from "../models/complaint";

@Injectable({
    providedIn: 'root'
  })
  export class ComplaintService {
    private dbPath = '/complaints';
  
    complaintsRef: AngularFirestoreCollection<Complaint>;
  
    constructor(private db: AngularFirestore) {
      this.complaintsRef = db.collection(this.dbPath);
    }

    getAll(): AngularFirestoreCollection<Complaint> {
        return this.complaintsRef;
      }
    
      create(complaint: Complaint): any {
        return this.complaintsRef.add({ ...complaint });
      }
    
      update(id: string, data: any): Promise<void> {
        return this.complaintsRef.doc(id).update(data);
      }
    
      delete(id: string): Promise<void> {
        return this.complaintsRef.doc(id).delete();
      }
    }
    