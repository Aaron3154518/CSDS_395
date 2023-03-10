import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SpotifyService } from '../spotify.service';

interface Song {
  id: string;
  name: string;
  artists: string[];
  album: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  songs: Song[] = [];
  searchForm = this.formBuilder.group({
    track: '',
    artist: '',
    year: undefined,
  });

  constructor(
    private formBuilder: FormBuilder,
    private spotifyService: SpotifyService
  ) {}

  onSubmit() {
    let params: any = this.searchForm.value;
    let track: string = params.track ? `track:${params.track}` : '';
    let artist: string = params.artist ? `artist:${params.artist}` : '';
    let year: string = params.year ? `year:${params.year}` : '';
    console.log(`search?type=track&q=${[track, artist, year].join(' ')}'`);
    this.spotifyService
      .query(`search?type=track&q=${[track, artist, year].join(' ')}'`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.songs = data.tracks.items
            .filter((tr: any) => tr)
            .map(
              (tr: any) =>
                <Song>{
                  id: tr.id,
                  name: tr.name,
                  artists: tr.artists.map((ar: any) => ar.name),
                  album: tr.album,
                }
            );
        },
        error: (err: any) => console.log(err),
      });
  }
}
