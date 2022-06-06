import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private urlService: UrlService,
    private http: HttpClient,
  ) { }
  /**
  * Giriş yapan kullanıcı bilgilerini heroku üzerindeki apiye gönderir
  * @param (string) email
  * @param (string) password
  * @returns (Observable<User>)
  */
  login(email: string, password: string): Observable<any> {
    const params = {
      email,
      password,
    };
    return this.http.post(`https://englishwithjoshu.herokuapp.com/api/login`, params);
  }
}
