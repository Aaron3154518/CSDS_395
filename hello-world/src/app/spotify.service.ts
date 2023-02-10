import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  static readonly URL: string = "https://api.spotify.com/v1";
  client_id = '5d369fb2e69e43e186efae6b4de10a68';
  redirect_uri = 'http://localhost:4200/';

  stringify(params: any) {
    return Object.entries(params).map(([k, v]: [any, any]) => `${k}=${v}`).join('&');
  }

  constructor(private http: HttpClient) {
    let scope = 'user-read-private%20user-read-email';

    // res.redirect('https://accounts.spotify.com/authorize?' +
    //   querystring.stringify({
    //     response_type: 'code',
    //     client_id: this.client_id,
    //     scope: scope,
    //     redirect_uri: this.redirect_uri,
    //     state: state
    //   }));

    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Origin', 'http://localhost:4200');

    let params = {
      response_type: 'code',
      redirect_uri: this.redirect_uri,
      client_id: this.client_id,
      scope: scope,
      //'Access-Control-Allow-Origin': 'https://accounts.spotify.com/authorize'
    };

    this.http.get(`https://accounts.spotify.com/authorize?${this.stringify(params)}`, { headers: headers }).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log("Error: ", err);
      }
    );
  }

  public getQuery(query: string) {
    const u: string = `${SpotifyService.URL}/${query}`;
    console.log(u);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer 5d369fb2e69e43e186efae6b4de10a68'
    });

    return this.http.get(u, { headers });
  }
}
