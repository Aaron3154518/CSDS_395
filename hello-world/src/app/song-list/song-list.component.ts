import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songs: string[] = ["Song1", "Song2", "Song3"];
  i: number = 4;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    this.spotifyService.code = this.route.snapshot.queryParams['code'];
    console.log(this.spotifyService.code);
    this.spotifyService.getToken().subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.spotifyService.token = data["access_token"];
          this.spotifyService.refresh_token = data["refresh_token"];
          this.spotifyService.getQuery('me/playlists').subscribe(
            {
              next:
                (data: any) => {
                  console.log(data);
                  this.spotifyService.getQuery(`playlists/${data.items[0].id}`).subscribe({
                    next: (data: any) => {
                      console.log(data);
                      this.songs = data.tracks.items.map(
                        (track: any) => track.track.name
                      );
                      console.log(this.songs);
                    },
                    error: (err: any) => {
                      console.log(err);
                    }
                  });
                },
              error:
                (err: any) => {
                  console.log(err);
                }
            }
          );
        },
        error: (err: any) => { console.log(err); }
      }
    );

  }
}
