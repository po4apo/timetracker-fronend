import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, throwError, timeout} from "rxjs";
import {catchError, filter, switchMap, take} from 'rxjs/operators';

const URL = 'http://158.160.105.71:8000/'

interface AuthResult {
  access: string,
  refresh?: string,

}

interface Refresh {
  refresh: string | null,
}

interface Profile {
  "id": number,
  "last_login": string,
  "username": string,
  "first_name": string,
  "last_name": string,
  "email": string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: number | null = null

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    localStorage.clear()
    this.http.post<AuthResult>(URL + 'api/token/', {"username": username, "password": password}).subscribe(
      (data) => {

        this.setAccessToken(data.access)
        if (data.refresh) {
          this.setRefreshToken(data.refresh)
        } else {
          console.debug('There is not refresh_token')
        }
        console.debug('Login successes')
        console.debug(localStorage)

        this.http.get<Profile>(URL + 'profile/').subscribe({
          next: data=>{
          this.setUserId(data.id.toString())
        },
        complete: () => {
          // Go to main page
          window.location.href = '..';
        }
      }
        )


      }
    )


  }

  logout() {
    localStorage.clear()
  }

  getAccessToken() {
    return localStorage.getItem('access_token')
  }

  setAccessToken(token: string) {
    localStorage.setItem('access_token', token)
  }

  getUserId() {
    return localStorage.getItem('userId')
  }

  setUserId(userId: string) {
    console.debug(`UserId = ${userId}`)
    localStorage.setItem('userId', userId)
  }


  getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  setRefreshToken(refresh_token: string) {
    localStorage.setItem('refresh_token', refresh_token)
  }
  isLoggedIn(){
    return this.getAccessToken() != undefined
  }
  // @ts-ignore
  refreshAccessToken() {
    let body: Refresh = {
      refresh: this.getRefreshToken()
    }
    console.debug(`body for refresh:\n ${body}`)
    if (body.refresh != null) {
      return this.http.post<AuthResult>(URL + 'api/token/refresh/', body)
    }
  }

}

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    const access_token = this.auth.getAccessToken()
    console.debug('access_token in interceptor:\n' + access_token)
    if (access_token) {
      console.debug('Processing req in intercept')
      const newReq = this.addTokenHeader(req, access_token)
      return next.handle(newReq).pipe(
        catchError(err => {
            if (err instanceof HttpErrorResponse && err.status == 401) {
              return this.handle401Error(req, next);
            }
            return throwError(err);
          }
        )
      )
    }
    return next.handle(req);
  }


  addTokenHeader(req: HttpRequest<any>, access_token: string) {
    console.debug('added token to header:\n' + access_token)
    return req.clone({headers: req.headers.set('Authorization', 'Bearer ' + access_token)});
  }


  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    let refresh = this.auth.refreshAccessToken()
    if (refresh instanceof Observable<AuthResult>) {
      refresh.subscribe({
          next: data => {
            this.auth.setAccessToken(data.access)
          },
          complete: () => {
            const access_token = this.auth.getAccessToken()
            if (access_token) {
              const newReq = this.addTokenHeader(req, access_token)
              return next.handle(newReq)
            }
            return next.handle(req);
          }
        }
      )

    }
    return next.handle(req);

  }
}
