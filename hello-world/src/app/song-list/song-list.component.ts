import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

interface Song {
  id: string;
  name: string;
  artists: string[];
  album: string;
}

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];
  i: number = 4;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.query('me/playlists').subscribe({
      next: (data: any) => {
        this.spotifyService.query(`playlists/${data.items[0].id}`).subscribe({
          next: (data: any) => {
            this.songs = data.tracks.items.map(
              (track: any) =>
                <Song>{
                  id: track.track.id,
                  name: track.track.name,
                  artists: track.track.artists.map((a: any) => a.name),
                  album: track.track.album.name,
                }
            );
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
