import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import Complaint from '../models/complaint';
import { ComplaintService } from '../services/complaint.service';

@Component({
  selector: 'app-complaints-details',
  templateUrl: './complaints-details.component.html',
  styleUrls: ['./complaints-details.component.css']
})
export class ComplaintsDetailsComponent implements OnInit {

  @Input() complaint?: Complaint;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentComplaint: Complaint = {
    title: '',
    description: '',
    published: false
  };
  message = '';

  constructor(
    private ComplaintService: ComplaintService,
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
    this.currentComplaint = { ...this.complaint };
  }

  updatePublished(status: boolean): void {
    console.log('updatePublished');
    if (this.currentComplaint.id) {
      this.ComplaintService.update(this.currentComplaint.id, { published: status })
      .then(() => {
        this.currentComplaint.published = status;
        this.message = 'The status was updated successfully!';
      })
      .catch(err => console.log(err));
    }
  }

  updateComplaint(): void {
    const data = {
      title: this.currentComplaint.title,
      description: this.currentComplaint.description
    };

    if (this.currentComplaint.id) {
      this.ComplaintService.update(this.currentComplaint.id, data)
        .then(
          () => {
            this.refreshList.emit();
            this.message = 'The complaint was updated successfully!';
          }
          )
        .catch(err => console.log(err));
    }
  }

  deleteComplaint(): void {
    if (this.currentComplaint.id) {
      this.ComplaintService.delete(this.currentComplaint.id)
        .then(() => {
          this.refreshList.emit();
          this.message = 'The complaint was updated successfully!';
        })
        .catch(err => console.log(err));
    }
  }

}
