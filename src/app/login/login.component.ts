import { Component } from '@angular/core';
import {AuthService} from "./login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  login = '';
  password = '';
  loginErr = '';
  passwordErr = '';

  constructor(private authService: AuthService) {
  }

  onSubmit() {
    console.log(`Login: ${this.login}, Password: ${this.password}`);
    this.authService.login(this.login, this.password).subscribe(
      {
        error: err => {
          if (err.status == 401){
            this.loginErr = err.error.detail
          }
          if(err.error.login){
            this.loginErr = err.error.login
          }
          if(err.error.password){
            this.passwordErr = err.error.password
          }
        }
      }
    )
  }
}
