import {Component, Input, OnChanges} from '@angular/core';
import {RegistrationService} from "./registration.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [RegistrationService]
})
export class RegistrationComponent{
  @Input()
  username: string = ''
  email: string = ''
  password: string = ''
  password2: string = ''

  usernameErr: string = ''
  emailErr: string = ''
  passwordErr: string = ''
  password2Err: string = ''



  constructor(private regService: RegistrationService) {
  }

  createUser(){
    this.regService.createUser(this.username, this.email, this.password, this.password2).subscribe(
      {
        next: value => {

        },
        complete: () =>  window.location.href = 'login/',

        error:err => {
          if(err.error.username){
            this.usernameErr = err.error.username
          }
          if(err.error.email){
            this.emailErr = err.error.email
          }
          if(err.error.password){
            this.passwordErr = err.error.password
          }
          if(err.error.password2){
            this.password2Err = err.error.password2
          }

        }
      }
    )
  }



}
