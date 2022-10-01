import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-uploader',
  templateUrl: './invoice-uploader.component.html',
  styleUrls: ['./invoice-uploader.component.css']
})
export class InvoiceUploaderComponent implements OnInit {

  constructor() { }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
    }
  }

  ngOnInit(): void {
  }

}
