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
  clusters: number[][] = [];
  searchForm = this.formBuilder.group({
    track: '',
    artist: '',
    year: undefined,
  });
  err: { [key: string]: string } = {
    track: '',
    artist: '',
    year: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.spotifyService.getPlaylists().subscribe({
      next: (pls: Playlist[]) => {
        this.getSongs(
          pls.reduce(
            (arr: string[], p: Playlist) =>
              arr.concat(
                p.songs.reduce(
                  (arr: string[], s: Song) => arr.concat([s.id]),
                  []
                )
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
      },
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
        order.sort(
          (
            [sa, da]: [SongFeatures, number],
            [sb, db]: [SongFeatures, number]
          ) => da - db
        );
        songs.sort((a: Song, b: Song) => {
          let oa: [SongFeatures, number] | undefined = order.find(
            ([s, d]: [SongFeatures, number]) => s.id == a.id
          );
          let ob: [SongFeatures, number] | undefined = order.find(
            ([s, d]: [SongFeatures, number]) => s.id == b.id
          );
          return !oa || !ob ? -1 : oa[1] - ob[1];
        });
        this.songs = songs;
      },
      error: (err: any) => console.log(err),
    });
  }

  search(args: any, offset: number = 0, limit: number = 20) {
    let keys: any[] = Object.keys(args).filter((k: any) => args[k]);
    let query_args: string = keys
      ? `&q=${keys.map((k: any) => args[k]).join(' ')}`
      : '';
    this.spotifyService
      .query(`search?type=track&offset=${offset}&limit=${limit}${query_args}'`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.filter(
            data.tracks.items
              .filter((tr: any) => tr)
              .map(
                (tr: any) =>
                  <Song>{
                    id: tr.id,
                    name: tr.name,
                    artists: tr.artists.map((ar: any) => ar.name),
                    album: tr.album.name,
                  }
              )
          );
        },
        error: (err: any) => console.log(err),
      });
  }

  onSubmit() {
    this.search(this.searchForm.value);
  }

  onSurprise() {
    this.search({}, Math.floor(Math.random() * 1000), 50);
  }
}
