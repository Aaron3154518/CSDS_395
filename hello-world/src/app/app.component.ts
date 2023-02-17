import { Component, ViewChild, AfterViewInit, OnDestroy, ElementRef, SimpleChange } from '@angular/core';
import { SpotifyService } from './spotify.service';

interface Spiral {
  r: number;
  theta: number;
};

interface Rain {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("MyCanvas")
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  readonly w: number = 250;

  @ViewChild("MyAudio")
  audio: ElementRef<HTMLAudioElement>;

  amps: Float32Array;
  idx: number = 0;
  interval: NodeJS.Timer;

  audioCtx: AudioContext;
  buff: AudioBuffer;
  source: AudioBufferSourceNode;
  rate: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnDestroy() {
    if (this.interval) {
      this.source.stop();
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
      this.ctx.canvas.width = this.ctx.canvas.height = this.w;
    }

    // this.spotifyService.getQuery('track/0GjEhVFGZW8afUYGChu3Rr').subscribe((data) => {
    //   console.log(data)
    // }, (error) => {
    //   console.log("Error ", error);
    // });
  }

  onPlay() {
    this.interval = setInterval(() => {
      this.onUpdate();
    }, 30);
  }

  fileChange(event: any) {
    let fr: FileReader = new FileReader();
    fr.onload = (e) => {
      const blob = new Blob([fr.result as ArrayBuffer], { type: "audio/wav" });
      const url = window.URL.createObjectURL(blob);
      this.audio.nativeElement.src = url;
      this.audio.nativeElement.load();
      // window.URL.revokeObjectURL(url);

      let a = new AudioContext();
      a.decodeAudioData(fr.result as ArrayBuffer,
        (data: AudioBuffer) => {
          this.amps = data.getChannelData(0);
          let max = this.amps.reduce((m, a) => Math.abs(a) > m ? Math.abs(a) : m, 0);
          this.amps = this.amps.map((a) => Math.abs(a) / max);
          this.rate = data.sampleRate;
        });
    }
    fr.readAsArrayBuffer(event.target.files[0]);
  }

  onUpdate() {
    if (!this.audio || !this.amps) {
      this.drawCircle(0);
      return;
    }

    this.draw();
  }

  rad = 0;

  draw() {
    let last_idx = this.idx;
    let prog = this.audio.nativeElement.currentTime / this.audio.nativeElement.duration;
    this.idx = Math.floor(this.amps.length * prog);

    this.rad = .9 * this.rad + .1 * this.amps[this.idx];

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.w, this.w);

    this.drawSpiral(last_idx, this.idx);
    this.drawRain(last_idx, this.idx);
    this.drawCircle(this.rad);
  }

  spirals: Spiral[] = [];
  t: number = 0;

  drawSpiral(i1: number, i2: number) {
    let dt = (i2 - i1) * this.rad / this.rate;

    this.spirals.forEach(
      (s: Spiral) => {
        s.r -= dt * this.w / 2;
        s.theta = (s.theta + dt * Math.PI / 2) % (2 * Math.PI);
      }
    );

    this.spirals = this.spirals.filter((s: Spiral) => s.r > 0);

    for (let i = Math.floor(this.t * 25), n = Math.floor((this.t + dt) * 25); i < n; i++) {
      this.spirals.push({ r: Math.random() * this.w, theta: Math.random() * 2 * Math.PI });
    }
    this.t += dt;

    this.spirals.forEach(
      (s: Spiral) => {
        let trail_dt = dt;
        let dr = -trail_dt * this.w / 2;
        let dtheta = trail_dt * Math.PI / 2;

        let trail = [3, 2, 2, 1, 1];
        trail.forEach(
          (t_r: number, i: number) => {
            let r = s.r - i * dr;
            let theta = s.theta - i * dtheta;

            this.ctx.beginPath();
            this.ctx.arc(
              this.w / 2 + r * Math.cos(theta),
              this.w / 2 + r * Math.sin(theta),
              t_r, 0, 2 * Math.PI
            );
            this.ctx.fillStyle = 'red';
            this.ctx.fill();
          }
        );
      }
    );
  }

  rain: Rain[] = [];
  ay: number = 100;

  drawRain(i1: number, i2: number) {
    let dt = (i2 - i1) / this.rate;

    this.rain.forEach((r: Rain) => {
      r.x += r.vx * dt;
      r.y += r.vy * dt + .5 * this.ay * dt * dt;
      r.vy += this.ay * dt;
    });

    this.rain = this.rain.filter((r: Rain) => r.y < this.w);

    let last_rad = (this.rad - .1 * this.amps[i2]) / .9;
    let dr = (this.rad - last_rad) / dt;
    for (let i = 0; i < Math.floor(dr * dr); i++) {
      let theta = Math.random() * Math.PI / 4;
      let v = 150;
      this.rain.push(
        {
          x: this.w / 2, y: this.w / 2,
          vx: v * Math.cos(theta) * (Math.random() >= .5 ? 1 : -1),
          vy: -v * Math.sin(theta)
        }
      );
    }

    this.ctx.fillStyle = "blue";
    this.rain.forEach((r: Rain) => {
      this.ctx.fillRect(r.x - 5, r.y - 5, 10, 10);
    });
  }

  drawCircle(r: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(this.w / 2, this.w / 2,
        (this.w / 2 - 5) * r + 4, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
    }
  }
}
