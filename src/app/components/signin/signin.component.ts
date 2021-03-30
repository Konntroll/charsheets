import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  error: string;

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
    this.error = null;
    this.loginService.errorMessage$.subscribe(errorMessage => {
      this.error = errorMessage;
    });
  }

  signin(email, password) {
    this.loginService.signin(email, password);
  }

}
