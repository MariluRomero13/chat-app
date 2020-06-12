import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { IMesage } from './../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getMessages() {
    return this.http.get<any>(`${environment.endPoint}/get-messages`);
  }

  storeMessage(message: string) {
    return this.http.post<any>(`${environment.endPoint}/store-message`, {message});
  }
}
