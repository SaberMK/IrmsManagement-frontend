import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { FuseUtils } from '@fuse/utils';
import * as jwt_decode from 'jwt-decode';

export class User {
  id: string;
  userName: string;
  email: string;

  constructor(user) {
      this.id = user.id || null;
      this.userName = user.userName || null;
      this.email = user.email || null;
  }
}

export const ANONYMOUS_USER: User = {
  id: undefined,
  userName: undefined,
  email: undefined
}

@Injectable()
export class AuthService {

  currentUser$: BehaviorSubject<User>;
  
  userName = 'admin';
  password = '12345';

  constructor() {
    this.currentUser$ = new BehaviorSubject(null);

    if (localStorage.getItem('access_token')) {
      this.currentUser$.next(this.getUser());
    }
  }

  login(userName: string, password: string) : boolean {

    if (userName === this.userName && password === this.password) {
      var header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      
      var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
      var encodedHeader = base64url(stringifiedHeader);
      
      var data = {
        id: FuseUtils.generateGUID(),
        userName: "admin",
        email: "admin@mail.com"
      };
      
      var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
      var encodedData = base64url(stringifiedData);
      
      var token = encodedHeader + "." + encodedData;
      this.setSession(token);

      return true;
    }

    return false;
  }

  setSession(token: any) {
    localStorage.setItem('access_token', token);
    this.currentUser$.next(this.getUser());
  }

  getUser(): User {

    return {
      id: jwt_decode(localStorage.getItem('access_token'))['id'],
      userName: jwt_decode(localStorage.getItem('access_token'))['userName'],
      email: jwt_decode(localStorage.getItem('access_token'))['email']
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUser$.next(ANONYMOUS_USER);
  }
}

export function base64url(source) {
    var encodedSource = CryptoJS.enc.Base64.stringify(source);
  
    encodedSource = encodedSource.replace(/=+$/, '');
  
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
  
    return encodedSource;
}