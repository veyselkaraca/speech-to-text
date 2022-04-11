import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { UrlService } from '../../services/url.service';
// import { Message } from '../models/message';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private http: HttpClient,
  ) { }

  sendMessage(input: string){
    const params = {
        inputs:{
          text:input
        }
    };
    return this.http.post<any>(`https://api-inference.huggingface.co/models/r3dhummingbird/DialoGPT-medium-joshua`, params,);
  }
}
