import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Song, Playlist } from './song-list/song-list.component';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  static readonly URL: string = 'https://api.spotify.com/v1';
  static readonly CLIENT_ID: string = '5d369fb2e69e43e186efae6b4de10a68';
  static readonly CLIENT_SECRET: string = 'c0b75dfd6d2349d281182cedcf632cbd';
  static readonly REDIRECT_URI: string = 'http://127.0.0.1:4200/login';
  code: string = '';
  token: string = '';
  refresh_token: string = '';
  private playlists: BehaviorSubject<Playlist[]> = new BehaviorSubject<
    Playlist[]
  >([
    /*
    {
      id: '2qrclYWp26KWIcs2fRgdVD',
      name: 'Actual Songs',
      songs: [
        {
          id: '53pZ8y3yMYUNpclGwIufu0',
          name: 'Conga',
          artists: ['Gloria Estefan', 'Miami Sound Machine'],
          album: 'Greatest Hits',
        },
        {
          id: '0OUKJBWS2IhHmVIxACwZzp',
          name: 'Wonderboy',
          artists: ['Tenacious D'],
          album: 'Tenacious D',
        },
        {
          id: '53XBXgtdqf1gmWMm3rqV27',
          name: 'Tribute',
          artists: ['Tenacious D'],
          album: 'Tenacious D',
        },
        {
          id: '27L8sESb3KR79asDUBu8nW',
          name: "Stacy's Mom",
          artists: ['Fountains Of Wayne'],
          album: 'Welcome Interstate Managers',
        },
        {
          id: '4UDmDIqJIbrW0hMBQMFOsM',
          name: "Stayin' Alive",
          artists: ['Bee Gees'],
          album: 'Staying Alive (Original Motion Picture Soundtrack)',
        },
        {
          id: '7ACxUo21jtTHzy7ZEV56vU',
          name: 'Crazy Train',
          artists: ['Ozzy Osbourne'],
          album: 'Blizzard Of Ozz (40th Anniversary Expanded Edition)',
        },
        {
          id: '1fDsrQ23eTAVFElUMaf38X',
          name: 'American Pie',
          artists: ['Don McLean'],
          album: 'American Pie',
        },
        {
          id: '6FBmHx1FuaSnTnnnaThgbF',
          name: 'Cum on Feel the Noize',
          artists: ['Quiet Riot'],
          album: 'Quiet Riot - Greatest Hits',
        },
        {
          id: '2kR3B09M6KeJnchOkxwszt',
          name: 'Summertime Girls - Studio Version',
          artists: ['Y&T'],
          album: "Best Of '81 To '85",
        },
        {
          id: '6QDbGdbJ57Mtkflsg42WV5',
          name: 'Hot for Teacher - 2015 Remaster',
          artists: ['Van Halen'],
          album: '1984 (Remastered)',
        },
        {
          id: '54eZmuggBFJbV7k248bTTt',
          name: 'A Horse with No Name',
          artists: ['America', 'George Martin'],
          album: 'America',
        },
        {
          id: '0UOxp1BpnD8uPQMKU4wKjz',
          name: 'I Shot The Sheriff',
          artists: ['Eric Clapton'],
          album: '461 Ocean Blvd. (Deluxe Edition)',
        },
        {
          id: '7Cp69rNBwU0gaFT8zxExlE',
          name: 'Ymca',
          artists: ['Village People'],
          album:
            'Was nicht passt, wird passend gemacht (Music Inspired By the Film)',
        },
        {
          id: '4bHsxqR3GMrXTxEPLuK5ue',
          name: "Don't Stop Believin'",
          artists: ['Journey'],
          album: 'Escape (Bonus Track Version)',
        },
        {
          id: '4ECNtOnqzxutZkXP4TE3n3',
          name: 'Separate Ways (Worlds Apart)',
          artists: ['Journey'],
          album: 'Frontiers',
        },
        {
          id: '1jDJFeK9x3OZboIAHsY9k2',
          name: "I'm Still Standing",
          artists: ['Elton John'],
          album: 'Too Low For Zero',
        },
        {
          id: '2grjqo0Frpf2okIBiifQKs',
          name: 'September',
          artists: ['Earth, Wind & Fire'],
          album: 'The Best Of Earth, Wind & Fire Vol. 1',
        },
        {
          id: '7x8dCjCr0x6x2lXKujYD34',
          name: 'The Pretender',
          artists: ['Foo Fighters'],
          album: 'Echoes, Silence, Patience & Grace',
        },
        {
          id: '5QTxFnGygVM4jFQiBovmRo',
          name: "(Don't Fear) The Reaper",
          artists: ['Blue Öyster Cult'],
          album: 'Agents Of Fortune',
        },
        {
          id: '0lP4HYLmvowOKdsQ7CVkuq',
          name: 'The Kill',
          artists: ['Thirty Seconds To Mars'],
          album: 'A Beautiful Lie',
        },
        {
          id: '2D52zjCyqEIQa221lhw6uk',
          name: 'This Is War',
          artists: ['Thirty Seconds To Mars'],
          album: 'This Is War',
        },
      ],
    },
    {
      id: '0I1hLbmPX9EPicrbqXtfcj',
      name: 'Not Actual Songs',
      songs: [
        {
          id: '7dUCFnaGSWLH6SdDP08NLP',
          name: 'Enormous Penis',
          artists: ["Da Vinci's Notebook"],
          album: 'Brontosaurus',
        },
        {
          id: '2Od8Vrqg0SAqVTLMHCMmWU',
          name: "I Whipped Batman's Ass",
          artists: ['Wesley Willis'],
          album: 'Rush Hour',
        },
        {
          id: '2L8mIvM1OwkJyGb3WwDFT3',
          name: 'My Ding-A-Ling',
          artists: ['Chuck Berry'],
          album: 'Have Mercy - His Complete Chess Recordings 1969 - 1974',
        },
        {
          id: '1qhyLsodjAGp2pfkAZDq6e',
          name: 'Dicko Mode',
          artists: ['Kusorare'],
          album: 'Dicko Mode',
        },
        {
          id: '4wzvawJbEFBVOTylSPgDJK',
          name: '2 Lil Dudes',
          artists: ['DigBar'],
          album: 'DIGBARGAYRAPS THE ALBUM',
        },
        {
          id: '0GVhi1shbV8dSYIdw6okqE',
          name: 'BIG DICK RANDY',
          artists: ['DigBar'],
          album: 'BAROWEEN',
        },
      ],
    },
  */
  ]);
  private $playlists: Observable<Playlist[]>; // = this.playlists.asObservable();

  stringify(params: any) {
    return Object.entries(params)
      .map(([k, v]: [any, any]) => `${k}=${v}`)
      .join('&');
  }

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  public getPlaylists(): Observable<Playlist[]> {
    if (!this.$playlists) {
      this.$playlists = this.playlists.asObservable();
      this.query('me/playlists').subscribe({
        next: (data: any) => {
          let playlists: Playlist[] = data.items.slice(0, 5).map(
            (p: any) =>
              <Playlist>{
                id: p.id,
                name: p.name,
                songs: [],
              }
          );
          playlists.forEach((pl: Playlist) =>
            this.query(`playlists/${pl.id}`).subscribe({
              next: (data: any) => {
                pl.songs = data.tracks.items
                  .filter((tr: any) => tr.track)
                  .map(
                    (tr: any) =>
                      <Song>{
                        id: tr.track.id,
                        name: tr.track.name,
                        artists: tr.track.artists.map((a: any) => a.name),
                        album: tr.track.album.name,
                      }
                  );
                this.playlists.next(playlists);
              },
              error: (err: any) => {
                console.log(err);
              },
            })
          );
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
    return this.$playlists;
  }

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
