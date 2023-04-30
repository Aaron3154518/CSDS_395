import { Component, Input } from '@angular/core';
import { Song } from '../song-list/song-list.component';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
})
export class SongsComponent {
  @Input() songs: Song[] = [];
  @Input() findSim: boolean = true;

  public get ids(): string[] {
    return this.songs.map((s) => s.id);
  }
}
