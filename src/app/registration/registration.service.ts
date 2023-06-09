import {Injectable, Input} from "@angular/core";
import {HttpClient} from "@angular/common/http";

const URL = 'http://158.160.105.71:8000/'

interface RegistrationResult {
  username: string,
  email: string
}

@Injectable()
export class RegistrationService {
  constructor(private httpClient: HttpClient) {
  }


  createUser(username: string, email: string, password: string, password2: string) {
    return this.httpClient.post<RegistrationResult>(URL + 'register/', {
      username: username,
      email: email,
      password: password,
      password2: password2
    })

  }
}
