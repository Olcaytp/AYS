import { Injectable } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "@angular/fire/compat/firestore";

import Payment from "../models/payment";

@Injectable({
    providedIn: 'root'
  })
  export class PaymentService {
    private dbPath = '/payments';
  
    paymentsRef: AngularFirestoreCollection<Payment>;
  
    constructor(private db: AngularFirestore) {
      this.paymentsRef = db.collection(this.dbPath);
    }

    getAll(): AngularFirestoreCollection<Payment> {
        return this.paymentsRef;
      }
    
      create(payment: Payment): any {
        return this.paymentsRef.add({ ...payment });
      }
    
      update(id: string, data: any): Promise<void> {
        return this.paymentsRef.doc(id).update(data);
      }
    
      delete(id: string): Promise<void> {
        return this.paymentsRef.doc(id).delete();
      }
    }
    