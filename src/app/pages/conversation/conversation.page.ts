import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Message } from 'src/app/models/message';
import { SocketProvider } from 'src/app/services/socket-provider';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { ConversationService } from './conversation.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { User } from 'src/app/models/user';
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
  receiverFullName: string = "English With Joshua";
  editorMsg;
  currentUser: User
  constructor(
    private socket: SocketProvider,
    public loadingController: LoadingController,
    private conversationService: ConversationService,
    public alertController: AlertController,
    public platform: Platform,
    // private media: Media,
  ) {
    // this.listenToSocketUpdateMessageStatusEvent();
    // this.listenToSocketUpdateListMessagesEvent();
  }

  async ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("user"))
    this.messages = []
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass: 'custom-loader-class',
      showBackdrop: false,
    });
    await loading.present();
    this.socket.connect();
    await this.loadingController.dismiss();
    this.socket.on('connect', () => {
      // this.getConversationMessages();
      this.socket.emit('conversationRoomNumber', this.conversationId);
    });
  }
  /**
 * Gelen mesaja sistemsel(kim gönderdi,ne zaman gönderildi) gibi fieldları ekleyip mesaj ekleme methoduna gönderir
 * @param {Message} message
 */
  sendTextMessage() {
    const message: Message = {
      message: this.editorMsg,
      createdAt: new Date(),
      userIsSender: true,
      sender: this.currentUser,
      type: 'text',
    };
    this.editorMsg = '';
    this.sendMessage(message);
    this.onFocus();
    this.pushNewMessage(message);
  }

  /**
 * Gelen parametreyi conversation servis içindeki mesaj gönderme methoduna gönderir, gelen mesajı mesaj listesine gönderir ve mesaj durumunu günceller
 * @param {Message} message
 */
  sendMessage(message: Message) {
    message.sender = JSON.parse(localStorage.getItem('user'));
    this.conversationService.sendMessage(message)
      .subscribe(
        res => {
          this.messages.forEach(element => {
            if (element.status !== "seen" && element.userIsSender) {
              element.status = 'sent';
            }
          });
          let response = res.response
          console.log(res)
          response.userIsSender = false
          this.messages.push({ _id: response.id, createdAt: response.createdAt, message: response.message, reciver: {}, status: "sent", type: response.type, sender: { _id:"BOT",firstName: 'joshua' }, userIsSender: false })
          this.socket.emit('update-messages-list');
        }
      );
  }
  /**
* Mesajın sesli bir şekilde okunmasını sağlar
* @param {string} message
*/
  messageToSpeech(text: string) {
    console.log(text)
    TextToSpeech.speak(text)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }
  /**
 * Mesajın mesajlar listesine eklenmesini sağlar ve scroolu aşağı çeker
 * @param {Message} message
 */
  pushNewMessage(message: Message) {
    message.status = 'pending';
    this.messages.push(message);
    this.scrollToBottom();
  }
  /**
  * Text area üzerine focuslanmasını sağlar
  */
  onFocus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }
  /**
  * sayfayı en alta indirir
  */
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 200);
  }
  /**
   * Component silinirken çalışır. angular componentlerinde life cycle'lardan biridir. Bkz: https://angular.io/guide/lifecycle-hooks
   */
  ngOnDestroy() {
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }
  /**
  * Uygulamanın ses desteği olup olmadığını ve izinlerin olup olmadığını kontrol eder eğer herşey yolundaysa dinleme methodunu çalıştırır
  */
  startRecord() {
    SpeechRecognition.isRecognitionAvailable().then((available: boolean) => {
      if (available) {
        SpeechRecognition.hasPermission().then((hasPermission: boolean) => {
          if (hasPermission) {
            this.startListening();
          } else {
            SpeechRecognition.requestPermission().then(
              () => {
                this.startListening()
              },
              () => { }
            );
          }
        })
      }
    }).catch((error) => {
      console.log(error)
    });
  }
  /**
  * Mikrofonu dinleyerek gelen verileri eşleştirir ve  en falza eşleşen (dizinin ilk elemanı) sonucu mesaj olarak gönderir
  */
  startListening() {
    SpeechRecognition.startListening({ language: 'en-US', showPopup: true })
      .subscribe(
        (matches: Array<string>) => {
          let message: Message = { type: "audio", createdAt: new Date(), message: matches[0], sender: this.currentUser, userIsSender: true, status: "pending" }
          this.pushNewMessage(message);
          this.sendMessage(message)

        },
        (onerror) => console.log('error:', onerror)
      )
  }
  /**
  * Bir sorun oluştuğu zaman kullanıcıya uyarı mesajı gönderir
  */
  async alertForRecognizer() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['Cancel', 'Open Modal', 'Delete']
    });

    await alert.present();
  }
}
