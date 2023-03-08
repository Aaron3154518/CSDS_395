import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
})
export class SongComponent implements OnInit, AfterViewInit {
  @ViewChild('Visualizer')
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  id: string = '';
  show: boolean = false;
  url: SafeResourceUrl;
  beats: number[] = [];

  embedController: any;

  paused: boolean = true;
  progress: number = 0;
  duration: number = 0;

  interval: NodeJS.Timer;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    let body: HTMLDivElement = <HTMLDivElement>document.body;
    let script: HTMLScriptElement = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
    script.async = true;
    script.defer = true;
    body.appendChild(script);

    this.id = this.route.snapshot.params['id'];
    this.spotifyService.query(`audio-analysis/${this.id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.beats = data.beats.map((b: any) => b.start);
        this.showSong(this.id);
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    // @ts-ignore
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      let element = document.getElementById('player');
      let options = {
        width: '50%',
        height: '200',
        uri: '',
      };
      // @ts-ignore
      let callback = (EmbedController) => {
        console.log('Called back');
        this.embedController = EmbedController;
        this.embedController.addListener('playback_update', (e: any) => {
          this.paused = e.data.isPaused;
          this.progress = e.data.position / e.data.duration;
          this.duration = e.data.duration;
        });

        this.showSong(this.id);
      };
      IFrameAPI.createController(element, options, callback);
    };

    this.interval = setInterval(() => {
      this.onUpdate();
    }, 30);
  }

  ngAfterViewInit(): void {
    let ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
      this.ctx.beginPath();
      this.ctx.fillRect(0, 0, 100, 100);
    }
  }

  onUpdate() {
    if (!this.paused) {
      this.progress += 30 / this.duration;
      let t: number = this.progress * this.beats[this.beats.length - 1];
      let i: number = this.beats.findIndex((b: number) => b > t);
      let b1: number = i == 0 ? 0 : this.beats[i - 1];
      let b2: number =
        i == -1 ? this.beats[this.beats.length - 1] : this.beats[i];
      let beatProg: number = (t - b1) / (b2 - b1);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.drawCircle(beatProg / 3 + 0.25);
    }
  }

  showSong(id: string) {
    if (this.embedController) {
      this.embedController.loadUri(`spotify:track:${id}`);
    }
  }

  drawCircle(r: number) {
    if (this.ctx) {
      let w: number = this.ctx.canvas.width;
      let h: number = this.ctx.canvas.height;
      this.ctx.beginPath();
      this.ctx.arc(w / 2, h / 2, Math.min(w, h) * r, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
    }
  }
}
