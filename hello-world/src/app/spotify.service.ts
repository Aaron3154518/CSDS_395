import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  first,
  Observable,
  Subject,
  takeUntil,
  timeInterval,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  static readonly URL: string = 'https://api.spotify.com/v1';
  static readonly CLIENT_ID: string = '5d369fb2e69e43e186efae6b4de10a68';
  static readonly CLIENT_SECRET: string = 'b4502636b2684379add901bed496a7c4';
  static readonly REDIRECT_URI: string = 'http://127.0.0.1:4200/login';
  code: string = '';
  token: string = '';
  refresh_token: string = '';

  stringify(params: any) {
    return Object.entries(params)
      .map(([k, v]: [any, any]) => `${k}=${v}`)
      .join('&');
  }

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  public login() {
    let scope = 'user-top-read user-library-read';

    let params = {
      response_type: 'code',
      redirect_uri: SpotifyService.REDIRECT_URI,
      client_id: SpotifyService.CLIENT_ID,
      scope: scope,
    };

    window.location.href = `https://accounts.spotify.com/authorize?${this.stringify(
      params
    )}`;
  }

  public query(query: string) {
    let subject = new Subject<any>();

    if (!this.token) {
      this.getToken(() => this.runQuery(query, subject), subject);
    } else {
      this.runQuery(query, subject);
    }

    return subject.asObservable();
  }

  private runQuery(query: string, subject: Subject<void>) {
    const u: string = `${SpotifyService.URL}/${query}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    this.http.get(u, { headers }).subscribe({
      next: (val: any) => subject.next(val),
      error: (err: any) => subject.error(err),
    });
  }

  private getToken(callback: () => void, subject: Subject<void>) {
    if (!this.code) {
      this.getCode(() => this.getToken(callback, subject), subject);
      return;
    }

    console.log('Get Token');

    const s = window.btoa(
      `${SpotifyService.CLIENT_ID}:${SpotifyService.CLIENT_SECRET}`
    );
    const headers = new HttpHeaders({
      Authorization: `Basic ${s}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = this.stringify({
      grant_type: 'authorization_code',
      code: this.code,
      redirect_uri: SpotifyService.REDIRECT_URI,
    });

    this.http
      .post(`https://accounts.spotify.com/api/token`, body, {
        headers: headers,
      })
      .subscribe({
        next: (data: any) => {
          this.token = data['access_token'];
          this.refresh_token = data['refresh_token'];

          callback();
        },
        error: (err: any) => {
          subject.error(err);
        },
      });
  }

  private getCode(callback: () => void, subject: Subject<void>) {
    console.log('Get Code');

    let newwindow = window.open(
      'http://localhost:4200/login',
      'Login',
      'height=400,width=550'
    );
    if (newwindow) {
      window.addEventListener(
        'message',
        (event) => {
          if (event.origin !== 'http://127.0.0.1:4200') return;

          this.ngZone.run(() => {
            this.code = event.data;

            callback();
          });
        },
        false
      );
    }
  }
}
