import { Component, OnInit } from '@angular/core';
import { ChatService } from './../../services/chat.service';
import { IUser } from './../../models/user';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  user: IUser;
  constructor(private chatSvc: ChatService, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.getMessages();
    this.user = this.authSvc.getUser();
    console.log(this.user)
  }

  sendMessage() {}

  private getMessages() {
    this.chatSvc.getMessages().subscribe(res => {
      this.messages = res;
    });
  }


}
