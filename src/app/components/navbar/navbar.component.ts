import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public loginService: LoginService,
              public dataService: DataService) { }

  ngOnInit(): void {
    this.loginService.user$.subscribe(user => {
      if (!(!!user)) {
        this.loginService.loggedIn = false;
      } else {
        this.loginService.loggedIn = true;
      }
    });
  }

}
