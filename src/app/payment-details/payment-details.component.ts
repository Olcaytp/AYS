import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import Payment from '../models/payment';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {

  @Input() payment?: Payment;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentPayment: Payment = {
    title: '',
    paymentCount: 0,
    paymentDate: new Date(),
    userName: '',
    flatNumber: 0,
    published: false
  };
  message = '';

  constructor(
    private PaymentService: PaymentService,
    public translateService: TranslateService
    ) { }

  ngOnInit(): void {
    this.message = '';
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentPayment = { ...this.payment };
  }

  updatePublished(status: boolean): void {
    console.log('updatePublished');
    if (this.currentPayment.id) {
      this.PaymentService.update(this.currentPayment.id, { published: status })
      .then(() => {
        this.currentPayment.published = status;
        this.message = 'The status was updated successfully!';
      })
      .catch(err => console.log(err));
    }
  }

  updatePayment(): void {
    const data = {
      title: this.currentPayment.title,
      paymentCount: this.currentPayment.paymentCount,
      paymentDate: this.currentPayment.paymentDate,
      userName: this.currentPayment.userName,
      flatNumber: this.currentPayment.flatNumber
    };

    if (this.currentPayment.id) {
      console.log('updatePayment' + this.currentPayment.paymentCount);
      this.PaymentService.update(this.currentPayment.id, data)
        .then(
          () => {
            this.refreshList.emit();
            this.message = 'The payment was updated successfully!';
          }
          )
        .catch(err => console.log(err));
    }
  }

  deletePayment(): void {
    if (this.currentPayment.id) {
      this.PaymentService.delete(this.currentPayment.id)
        .then(
          () => {
            this.refreshList.emit();
            this.message = 'The payment was deleted successfully!';
          }
          )
        .catch(err => console.log(err));
    }
  }

}
