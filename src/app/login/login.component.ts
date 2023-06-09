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

  constructor(private authService: AuthService) {
  }

  onSubmit() {
    console.log(`Login: ${this.login}, Password: ${this.password}`);
    this.authService.login(this.login, this.password)
  }
}
