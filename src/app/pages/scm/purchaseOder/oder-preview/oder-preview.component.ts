import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oder-preview',
  templateUrl: './oder-preview.component.html',
  styleUrls: ['./oder-preview.component.scss']
})
export class OderPreviewComponent implements OnInit {

  isSuccessModalOpen: Boolean = false;
  modalText: string = " Invooice created successfully"
  constructor(
    private router: Router
  ) { } 

  toggleSuccessModal() {
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
  }
  ngOnInit(): void {
  }

}
