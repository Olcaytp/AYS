import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import Anounce from '../models/anounce';
import { AnounceService } from '../services/anounce.service';

@Component({
  selector: 'app-anounce-details',
  templateUrl: './anounce-details.component.html',
  styleUrls: ['./anounce-details.component.css']
})
export class AnounceDetailsComponent implements OnInit {

  @Input() anounce?: Anounce;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentAnounce: Anounce = {
    title: '',
    description: '',
    published: false
  };
  message = '';

  constructor(private AnounceService: AnounceService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentAnounce = { ...this.anounce };
  }

  updatePublished(status: boolean): void {
    console.log('updatePublished');
    if (this.currentAnounce.id) {
      this.AnounceService.update(this.currentAnounce.id, { published: status })
      .then(() => {
        this.currentAnounce.published = status;
        this.message = 'The status was updated successfully!';
      })
      .catch(err => console.log(err));
    }
  }

  updateAnounce(): void {
    const data = {
      title: this.currentAnounce.title,
      description: this.currentAnounce.description
    };

    if (this.currentAnounce.id) {
      this.AnounceService.update(this.currentAnounce.id, data)
        .then(
          () => {
            this.refreshList.emit();
            this.message = 'The anounce was updated successfully!';
          }
          )
        .catch(err => console.log(err));
    }
  }

  deleteAnounce(): void {
    if (this.currentAnounce.id) {
      this.AnounceService.delete(this.currentAnounce.id)
        .then(() => {
          this.refreshList.emit();
          this.message = 'The anoune was updated successfully!';
        })
        .catch(err => console.log(err));
    }
  }

}
