import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SpotifyService } from '../spotify.service';
import { kmeans, min_dist } from './cluster';
import { Playlist, Song } from '../song-list/song-list.component';
import { Observable, Subject } from 'rxjs';

interface SongFeatures {
  id: string;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  valence: number;
}

function getSongFeatures(s: SongFeatures): number[] {
  return Object.values(s).slice(1);
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  songs: Song[] = [];
  userSongs: SongFeatures[] = [];
  playlists: Playlist[] = [
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
  ];
  clusters: number[][] = [];
  searchForm = this.formBuilder.group({
    track: '',
    artist: '',
    year: undefined,
  });

  constructor(
    private formBuilder: FormBuilder,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.getSongs(
      this.playlists.reduce(
        (arr: string[], p: Playlist) =>
          arr.concat(
            p.songs.reduce((arr: string[], s: Song) => arr.concat([s.id]), [])
          ),
        []
      )
    ).subscribe({
      next: (songs: SongFeatures[]) => {
        this.userSongs = songs;
        this.clusters = kmeans(
          songs.map((s: SongFeatures) => getSongFeatures(s)),
          3
        );
      },
      error: (err: any) => console.log(err),
    });
  }

  getSongs(ids: string[]): Observable<SongFeatures[]> {
    let sub: Subject<SongFeatures[]> = new Subject<SongFeatures[]>();
    this.spotifyService.query(`audio-features?ids=${ids.join(',')}`).subscribe({
      next: (data: any) => {
        sub.next(
          data.audio_features.map(
            (f: any) =>
              <SongFeatures>{
                id: f.id,
                acousticness: f.acousticness,
                danceability: f.danceability,
                energy: f.energy,
                instrumentalness: f.instrumentalness,
                key: f.key,
                liveness: f.liveness,
                loudness: f.loudness,
                mode: f.mode,
                speechiness: f.speechiness,
                tempo: f.tempo,
                time_signature: f.time_signature,
                valence: f.valence,
              }
          )
        );
      },
      error: (err: any) => console.log(err),
    });
    return sub.asObservable();
  }

  filter(songs: Song[]) {
    this.getSongs(songs.map((s: Song) => s.id)).subscribe({
      next: (song_fs: SongFeatures[]) => {
        let order: [SongFeatures, number][] = song_fs.map((s: SongFeatures) => [
          s,
          min_dist(getSongFeatures(s), this.clusters)[1],
        ]);
        console.log(order);
        order.sort(
          (
            [sa, da]: [SongFeatures, number],
            [sb, db]: [SongFeatures, number]
          ) => da - db
        );
        console.log(songs);
        songs.sort((a: Song, b: Song) => {
          let oa: [SongFeatures, number] | undefined = order.find(
            ([s, d]: [SongFeatures, number]) => s.id == a.id
          );
          let ob: [SongFeatures, number] | undefined = order.find(
            ([s, d]: [SongFeatures, number]) => s.id == b.id
          );
          return !oa || !ob ? -1 : oa[1] - ob[1];
        });
        console.log('->');
        console.log(songs);
        this.songs = songs;
      },
      error: (err: any) => console.log(err),
    });
  }

  onSubmit() {
    let params: any = this.searchForm.value;
    let track: string = params.track ? `track:${params.track}` : '';
    let artist: string = params.artist ? `artist:${params.artist}` : '';
    let year: string = params.year ? `year:${params.year}` : '';
    this.spotifyService
      .query(`search?type=track&q=${[track, artist, year].join(' ')}'`)
      .subscribe({
        next: (data: any) => {
          this.filter(
            data.tracks.items
              .filter((tr: any) => tr)
              .map(
                (tr: any) =>
                  <Song>{
                    id: tr.id,
                    name: tr.name,
                    artists: tr.artists.map((ar: any) => ar.name),
                    album: tr.album,
                  }
              )
          );
        },
        error: (err: any) => console.log(err),
      });
  }
}
