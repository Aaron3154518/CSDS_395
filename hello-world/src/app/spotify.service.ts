import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  static readonly URL: string = "https://api.spotify.com/v1";
  static readonly CLIENT_ID: string = '';
  static readonly CLIENT_SECRET: string = '';
  redirect_uri: string = 'http://127.0.0.1:4200/main';
  code: string = '';
  token: string = '';
  refresh_token: string = '';

  stringify(params: any) {
    return Object.entries(params).map(([k, v]: [any, any]) => `${k}=${v}`).join('&');
  }

  constructor(private http: HttpClient) {
  }

  public login(redirect: string) {
    let scope = 'user-top-read user-library-read';

    this.redirect_uri = redirect;
    let params = {
      response_type: 'code',
      redirect_uri: this.redirect_uri,
      client_id: SpotifyService.CLIENT_ID,
      scope: scope,
    };

    window.location.href = `https://accounts.spotify.com/authorize?${this.stringify(params)}`;
  }

  public getToken() {
    const s = window.btoa(`${SpotifyService.CLIENT_ID}:${SpotifyService.CLIENT_SECRET}`)
    const headers = new HttpHeaders({
      'Authorization': `Basic ${s}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = this.stringify({
      grant_type: 'authorization_code',
      code: this.code,
      redirect_uri: this.redirect_uri
    });

    console.log(body);

    return this.http.post(`https://accounts.spotify.com/api/token`,
      body,
      {
        headers: headers
      })
  }

  public getQuery(query: string) {
    const u: string = `${SpotifyService.URL}/${query}`;
    console.log(u);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(u, { headers });
  }
}
