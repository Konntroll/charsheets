import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  error: string;

  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.error = null;
    this.loginService.errorMessage$.subscribe(errorMessage => {
      this.error = errorMessage;
    });
  }

  validate() {
    if (this.password !== this.passwordConfirmation) {
      this.error = 'Passwords don\'t match.';
      return;
    }
    if (!this.password) {
      this.error = 'Password is required.';
      return;
    }
    this.loginService.signup(this.email, this.password, this.name);
  }

}
