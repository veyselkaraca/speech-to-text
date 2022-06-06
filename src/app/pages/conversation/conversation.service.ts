import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { UrlService } from '../../services/url.service';
// import { Message } from '../models/message';
import { Observable } from 'rxjs/internal/Observable';
import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private http: HttpClient,
  ) { }
  /**
  * Gelen mesajı heroku üzerindeki apiye gönderir
  * @param (Message) message
  */
  sendMessage(message: Message){
    return this.http.post<any>(`https://englishwithjoshu.herokuapp.com/api/sendMessage`, message,);
  }
}
