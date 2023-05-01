import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../song-list/song-list.component';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-recommender',
  templateUrl: './recommender.component.html',
  styleUrls: ['./recommender.component.css'],
})
export class RecommenderComponent {
  @Input() seedIds: string | string[] = [];
  @Input() showButton: boolean = true;
  @Input() nbayes: boolean = false;
  songs: Song[] = [];
  scores: number[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private spotifyService: SpotifyService
  ) {}

  findSimilar() {
    this.loading = true;
    let req: string =
      typeof this.seedIds === 'string'
        ? `t,${this.seedIds}`
        : this.nbayes
        ? `b,${this.seedIds.join(',')}`
        : `l,${this.seedIds.join(',')}`;
    this.http
      .post('http://127.0.0.1:3300', req, {
        responseType: 'text',
      })
      .subscribe({
        next: (data: string) => {
          let d_split: string[] = data.split('\n');
          this.scores = d_split[1].split(',').map((s: string) => +s);
          this.scores.splice(0, 1);
          let ids = d_split[0].split(',');
          ids.splice(0, 1);
          this.spotifyService.query(`tracks?ids=${ids.join(',')}`).subscribe({
            next: (data: any) => {
              this.loading = false;
              this.songs = data.tracks.map(
                (tr: any) =>
                  <Song>{
                    id: tr.id,
                    name: tr.name,
                    album: tr.album.name,
                    artists: tr.artists.map((ar: any) => ar.name),
                  }
              );
            },
            error: (err: any) => console.log(err),
          });
        },
        error: (err: any) => console.log('Error', err),
      });
  }
}
