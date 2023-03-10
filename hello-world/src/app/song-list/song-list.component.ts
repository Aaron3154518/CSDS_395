import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
// import { MongoClient } from 'mongodb';

export interface Song {
  id: string;
  name: string;
  artists: string[];
  album: string;
}

// const uri = 'mongodb://localhost:27017';

// const client = new MongoClient(uri);

// async function run() {
//   try {
//     await client.connect();
//     const database = client.db('senior_project');
//     // Your database operations go here
//   } catch (err) {
//     console.error(err);
//   } finally {
//     await client.close();
//   }
// }

// run();

// console.log('Success');
export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  playlists: Playlist[] = [];
  i: number = 4;
  collapsed: { [key: string]: boolean } = {};

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getPlaylists().subscribe({
      next: (pls: Playlist[]) => (this.playlists = pls),
    });
  }
}
