import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../song-list/song-list.component';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-recommender',
  templateUrl: './recommender.component.html',
  styleUrls: ['./recommender.component.css'],
})
export class RecommenderComponent implements OnInit {
  @Input() seedName: string = '';
  @Input() seedArtist: string = '';
  @Input() seedIds: string[] = [];
  @Input() showButton: boolean = true;
  songs: Song[] = [];
  scores: number[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    if (
      this.seedIds.length === 0 &&
      this.seedName.length === 0 &&
      this.seedArtist.length === 0
    ) {
      console.log('Get user ids');
    }
  }

  findSimilar() {
    this.loading = true;
    let req: string =
      this.seedIds.length > 0
        ? `p,${this.seedIds.join(',')}`
        : `t,${this.seedName},${this.seedArtist}`;
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
