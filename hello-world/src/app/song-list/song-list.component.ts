import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements AfterViewInit {
  songs: string[] = ["Song1", "Song2", "Song3"];
  i: number = 4;

  ngAfterViewInit() {
    // let interval = setInterval(
    //   () => {
    //     this.songs.push("Song" + this.i);
    //     this.i++;
    //   }, 2000
    // );
  }
}
