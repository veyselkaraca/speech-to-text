import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, Events, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginForm: FormGroup;
   /**
  * Constructor
  */
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastController: ToastController,
    private events: Events,
    public loadingController: LoadingController,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(
          // tslint:disable-next-line: max-line-length
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]],
      password: ['', Validators.required],
    });
  }
  /**
  * login formda doldurulan verileri alır ve userService'den login methoduna gönderir
  */
  async login() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass: 'custom-loader-class',
      showBackdrop: false,
    });
    await loading.present();
    const email: string = this.loginForm.value.email;
    const password: string = this.loginForm.value.password;
    this.userService.login(email, password).subscribe(
      async res => {
        if (res.user) {
          localStorage.setItem('chatToken', "token");
          localStorage.setItem('user', JSON.stringify(res.user));
          this.events.publish('user:logged', res.user);
          this.router.navigate(['conversation'], { replaceUrl: true });
          await this.loadingController.dismiss();
          const toast = await this.toastController.create({
            color: 'success',
            message: 'Login successful',
            duration: 2000
          });
          toast.present();
        }else{
          await this.loadingController.dismiss();
          const toast = await this.toastController.create({
            color: 'danger',
            message: 'Login failed',
            duration: 2000
          });
          toast.present();
        }

      },
      async err => {
          await this.loadingController.dismiss();
          const toast = await this.toastController.create({
            color: 'danger',
            message: err.error.message,
            duration: 2000
          });
          toast.present();
        }
      );
  }
}
