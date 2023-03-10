import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../spotify.service';

interface Song {
  duration: number;
  num_samples: number;
  sample_rate: number;
  loudness: number;
  beats: number[];
  segments: Segment[];
}

interface Segment {
  t: number;
  loud_min: number;
  loud_max: number;
}

interface Circle {
  cx: number;
  cy: number;
  r_factor: number;
  t_factor: number;
  color: string;
}

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
  name: string = '';
  artist: string = '';
  show: boolean = false;
  url: SafeResourceUrl;

  embedController: any;

  paused: boolean = true;
  progress: number = 0;
  song: Song = {
    duration: 0,
    num_samples: 0,
    sample_rate: 0,
    loudness: 0,
    beats: [],
    segments: [],
  };
  circles: Circle[] = [];
  circle: Circle = {
    cx: 0.5,
    cy: 0.5,
    r_factor: 0.75,
    t_factor: 0,
    color: 'red',
  };

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
        this.song.duration = data.track.duration;
        this.song.num_samples = data.track.num_samples;
        this.song.sample_rate = data.track.analysis_sample_rate;
        this.song.loudness = data.track.loudness;
        this.song.beats = data.beats.map((b: any) => b.start);
        this.song.segments = data.segments.map(
          (s: any) =>
            <Segment>{
              t: s.start,
              loud_min: s.loudness_start,
              loud_max: s.loudness_max,
            }
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.spotifyService.query(`tracks/${this.id}`).subscribe({
      next: (data: any) => {
        this.name = data.name;
        this.artist = data.artists[0].name;
      },
      error: (err: any) => console.log(err),
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
      this.circles = Array.from(
        { length: Math.floor(Math.random() * 10 + 10) },
        () =>
          <Circle>{
            cx: Math.random() * 0.9 + 0.05,
            cy: Math.random() * 0.9 + 0.05,
            r_factor: Math.random() * 0.3 + 0.05,
            t_factor: 0,
            color: 'green',
          }
      );
    }
  }

  onUpdate() {
    if (!this.paused) {
      this.progress += 0.03 / this.song.duration;
      let [b1, b2, p]: [number, number, number] = this.find(
        this.progress * this.song.duration,
        this.song.beats
      );
      p = p / 3 + 0.25;
      let [s1, s2, p2]: [Segment, Segment, number] = this.find(
        this.progress * this.song.duration,
        this.song.segments,
        (v: Segment) => v.t
      );
      let w: number = this.ctx.canvas.clientWidth;
      let h: number = this.ctx.canvas.clientHeight;
      let m: number = Math.max(w, h);
      this.ctx.canvas.width = (w * 1000) / m;
      this.ctx.canvas.height = (h * 1000) / m;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      let new_t_factor: number =
        this.song.loudness / ((s1.loud_max - s1.loud_min) * p2 + s1.loud_min);
      this.circle.t_factor *= 0.975;
      if (new_t_factor > this.circle.t_factor) {
        this.circle.t_factor = new_t_factor;
      }
      this.drawCircle(this.circle);
      this.circles.forEach((c: Circle) => {
        c.t_factor *= 0.75;
        c.t_factor += 0.25 * p;
        this.drawCircle(c);
      });
    }
  }

  find<T>(
    t: number,
    arr: T[],
    get_t: (v: T) => number = (v) => v as number
  ): [T, T, number] {
    let v0: T = arr[0];
    if (t < get_t(v0)) {
      return [v0, v0, t / get_t(v0)];
    }
    v0 = arr[arr.length - 1];
    if (t >= get_t(v0)) {
      return [v0, v0, 1];
    }
    let i: number = arr.findIndex((v: any) => get_t(v) > t);
    v0 = arr[i - 1];
    let v1: T = arr[i];
    return [v0, v1, (t - get_t(v0)) / (get_t(v1) - get_t(v0))];
  }

  showSong(id: string) {
    if (this.embedController) {
      this.embedController.loadUri(`spotify:track:${id}`);
    }
  }

  drawCircle(c: Circle) {
    if (this.ctx) {
      let w: number = this.ctx.canvas.width;
      let h: number = this.ctx.canvas.height;
      let r: number = Math.min(w, h) / 2;
      this.ctx.beginPath();
      this.ctx.arc(
        c.cx * w,
        c.cy * h,
        r * c.r_factor * c.t_factor,
        0,
        2 * Math.PI
      );
      this.ctx.fillStyle = c.color;
      this.ctx.fill();
    }
  }
}
