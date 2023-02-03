import { Component, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("MyCanvas")
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;

  @ViewChild("MyAudio")
  audio: ElementRef<HTMLAudioElement>;

  amps: Float32Array;
  idx: number = 0;
  interval: NodeJS.Timer;

  audioCtx: AudioContext;
  buff: AudioBuffer;
  source: AudioBufferSourceNode;
  rate: any;

  ngOnDestroy() {
    if (this.interval) {
      this.source.stop();
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  onPlay() {
    this.interval = setInterval(() => {
      if (!this.audio || !this.amps) {
        this.drawCircle(0);
        return;
      }

      let prog = this.audio.nativeElement.currentTime / this.audio.nativeElement.duration;
      this.idx = Math.floor(this.amps.length * prog);
      this.drawCircle(this.amps[this.idx]);
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

          // this.audioCtx = new window.AudioContext();
          // // Required to start audio system for Aaron
          // this.buff = this.audioCtx.createBuffer(2, this.audioCtx.sampleRate * 3, this.audioCtx.sampleRate);
          // this.source = this.audioCtx.createBufferSource();
          // this.source.connect(this.audioCtx.destination);

          // if (this.interval) {
          //   this.source.stop();
          //   clearInterval(this.interval);
          // }
          // this.source.buffer = data;

          // this.idx = 0;
          // this.interval = setInterval(() => {
          //   this.drawCircle(this.amps[this.idx]);

          //   if (this.idx === 0) {
          //     //this.source.start();
          //   }

          //   this.idx += data.sampleRate * 0.016;
          //   if (this.idx >= this.amps.length) {
          //     this.source.stop();
          //     clearInterval(this.interval);
          //     return;
          //   }
          // }, 16);
        });
    }
    fr.readAsArrayBuffer(event.target.files[0]);
  }

  rad = 0;

  drawCircle(r: number) {
    if (this.ctx) {
      let w = this.ctx.canvas.width;
      let h = this.ctx.canvas.height;

      this.ctx.clearRect(0, 0, w, h);

      this.rad = .9 * this.rad + .1 * r;

      this.ctx.beginPath();
      this.ctx.arc(w / 2, h / 2, (Math.min(w, h) / 2 - 5) * this.rad + 4, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = '#003300';
      this.ctx.stroke();
    }
  }
}
