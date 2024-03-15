import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userlock',
  templateUrl: './userlock.component.html',
  styleUrls: ['./userlock.component.scss']
})
export class UserlockComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }
  loadPopUP(message:string)
  {

    Swal.fire('Warning', "Access has been blocked by Admin to upload data", 'warning');
  }

}
