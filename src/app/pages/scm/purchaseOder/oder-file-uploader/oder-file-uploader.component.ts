import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oder-file-uploader',
  templateUrl: './oder-file-uploader.component.html',
  styleUrls: ['./oder-file-uploader.component.css']
})
export class OderFileUploaderComponent implements OnInit {
  onFileChange(event) {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
