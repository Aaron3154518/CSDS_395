import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Song } from '../song-list/song-list.component';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-recommender',
  templateUrl: './recommender.component.html',
  styleUrls: ['./recommender.component.css'],
})
export class RecommenderComponent {
  @Input() seedName: string = '';
  @Input() seedArtist: string = '';
  songs: Song[] = [];
  scores: number[] = [];

  constructor(
    private http: HttpClient,
    private spotifyService: SpotifyService
  ) {}

  findSimilar() {
    this.http
      .post('http://127.0.0.1:3300', `${this.seedName},${this.seedArtist}`, {
        responseType: 'text',
      })
      .subscribe({
        next: (data: string) => {
          let d_split: string[] = data.split('\n');
          this.scores = d_split[1].split(',').map((s: string) => +s);
          this.spotifyService.query(`tracks?ids=${d_split[0]}`).subscribe({
            next: (data: any) =>
              (this.songs = data.tracks.map(
                (tr: any) =>
                  <Song>{
                    id: tr.id,
                    name: tr.name,
                    album: tr.album.name,
                    artists: tr.artists.map((ar: any) => ar.name),
                  }
              )),
            error: (err: any) => console.log(err),
          });
        },
        error: (err: any) => console.log('Error', err),
      });
  }
}
