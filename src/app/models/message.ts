import { User } from './user';

export class Message {
  _id?: string;
  sender?: User;
  reciver?:User;
  message?: string;
  type:'text'|'audio';
  status?: 'pending' | 'sent' | 'seen';
  createdAt?: Date;
  userIsSender?: boolean;
}
