import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatService } from './../../services/chat.service';
import { IUser } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import Ws from '@adonisjs/websocket-client';
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  user: IUser;
  chatForm: FormGroup;
  constructor(private chatSvc: ChatService,
              private router: Router,
              private authSvc: AuthService) { this.createForm(); }

  ngOnInit(): void {
    this.getMessages();
    this.user = this.authSvc.getUser();
    this.wsConnect();
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message').value;
      this.chatSvc.storeMessage(message).subscribe();
      this.chatForm.get('message').reset();
    }
  }

  private getMessages() {
    this.chatSvc.getMessages().subscribe(res => {
      this.messages = res;
    });
  }

  private createForm() {
    this.chatForm = new FormGroup({
      message: new FormControl('', Validators.required)
    });
  }

  wsConnect() {
    const ws = Ws(environment.ws, {path: 'ws'});
    ws.connect();
    ws.on('open', () => {
      const channel = ws.subscribe('chat');
      channel.on('new:chat', (message: any) => {
        this.messages.push(message);
      });
    });

    ws.on('error', (error) => {
        console.log(error);
    });
  }

  logout() {
    this.authSvc.logout().subscribe(res => {
      return this.router.navigate(['/login'])
    });
  }

}
