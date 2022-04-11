import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Message } from 'src/app/models/message';
import { SocketProvider } from 'src/app/services/socket-provider';
import { LoadingController } from '@ionic/angular';
import { ConversationService } from './conversation.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) private content: any;
  @ViewChild('chatInput', { static: true }) messageInput: ElementRef;
  messages: Message[];
  conversationId: string;
  receiverFullName: string="English With Joshua";
  editorMsg;
  receiverId;

  constructor(
    private socket: SocketProvider,
    public loadingController: LoadingController,
    private conversationService:ConversationService
  ) {
    // this.listenToSocketUpdateMessageStatusEvent();
    // this.listenToSocketUpdateListMessagesEvent();
  }

  async ngOnInit() {
    let date=new Date();
    this.messages=[]
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass: 'custom-loader-class',
      showBackdrop: false,
    });
    await loading.present();
    this.socket.connect();
    await this.loadingController.dismiss();
    this.socket.on('connect',() => {
      // this.getConversationMessages();
      this.socket.emit('conversationRoomNumber', this.conversationId);
    });
  }
  sendMessage() {
    const message: Message = {
      message: this.editorMsg,
      conversationId: this.conversationId,
      receiversIds: [this.receiverId],
      userIsSender: true,
      createdAt: new Date(),
    };
    let sendedMessage=this.editorMsg
    this.editorMsg = '';
    this.onFocus();
    this.pushNewMessage(message);
    this.conversationService.sendMessage(sendedMessage)
    .subscribe(
      res => {
        this.messages.forEach(element => {
          if (element.message === message.message && element.userIsSender) {
            element.status = 'sent';
          }
        });
        
        console.log(res.generated_text)
        this.messages.push({_id:"1",conversationId:"1",createdAt:message.createdAt,isRead:false,message:res.generated_text,purchaseId:1,receivers:[{receiverId:"2",isRead:false}],receiversIds:["2"],senderFullName:"bot",userIsSender:false,senderId:"1",status:"sent"})
        this.socket.emit('update-messages-list');
      }
    );
    
  }

  pushNewMessage(message: Message) {
    message.status = 'pending';
    this.messages.push(message);
    this.scrollToBottom();
  }

  onFocus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 200);
  }

  ngOnDestroy() {
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }
  // listenToSocketUpdateListMessagesEvent() {
  //   this.socket.on('new-message', () => {
  //     this.getConversationMessages();
  //     this.scrollToBottom();
  //   });
  // }

  // listenToSocketUpdateMessageStatusEvent() {
  //   this.socket.on('seen', (messageId) => {
  //     const message = this.messages.find(msg => msg._id === messageId);
  //     if (message) {
  //       message.status = 'seen';
  //     }
  //   });
  // }

  // getConversationMessages() {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   const queryParams = this.activatedRoute.snapshot.queryParams;
  //   const receiver: User = JSON.parse(queryParams.receiver);
  //   this.receiverFullName = receiver.firstName + ' ' + receiver.lastName;
  //   this.receiverId = receiver._id;
  //   if (user) {
  //     const participants: string[] = [receiver._id, user.id];
  //     this.conversationMessagesService.getConversationMessages(participants).subscribe(res => {
  //       if (typeof res === 'string') {
  //         this.conversationId = res;
  //       } else {
  //         this.messages = res.conversationMessages;
  //         this.conversationId = res.conversationId;
  //         this.messages = this.messages.map(message => {
  //           return this.filterMessageAndUpdateStatus(message, user);
  //         });
  //         this.scrollToBottom();
  //       }
  //     });
  //   }
  // }

  // filterMessageAndUpdateStatus(message: Message, user: any): Message {
  //   message.senderFullName = message.sender.firstName + ' ' + message.sender.lastName;
  //   if (message.sender._id === user.id) {
  //     message.userIsSender = true;
  //   }
  //   message.receivers.forEach(receiver => {
  //     if (!receiver.isRead && !message.userIsSender) {
  //       this.conversationMessagesService.updateMessageStatusToRead(message._id, receiver.receiverId)
  //         .subscribe(() => {
  //           this.socket.emit('update-message-status', message._id);
  //         });
  //     }
  //     if (message.userIsSender) {
  //       if (receiver.isRead) {
  //         message.status = 'seen';
  //       } else {
  //         message.status = 'sent';
  //       }
  //     }
  //   });
  //   return message;
  // }

  

}
