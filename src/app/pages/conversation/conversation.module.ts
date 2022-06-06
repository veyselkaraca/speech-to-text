import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConversationPage } from './conversation.page';
import {MediaCapture} from '@awesome-cordova-plugins/media-capture/ngx'
import { MatIconModule } from '@angular/material';
const routes: Routes = [
  {
    path: '',
    component: ConversationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatIconModule
  ],
  declarations: [ConversationPage],
  providers: [MediaCapture]
})
export class ConversationPageModule {}
