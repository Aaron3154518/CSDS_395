import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  constructor(private http: HttpClient) {}

  test() {
    const req = this.http.get('http://127.0.0.1:3000', {
      responseType: 'text',
    });
    req.subscribe({
      next: (data: string) => {
        let d_split: string[] = data.split('\n');
        let idxs: string[] = d_split[0].split(',');
        let scores: number[] = d_split[1].split(',').map((s: string) => +s);
        console.log(idxs, scores);
      },
      error: (err: any) => console.log('Error', err),
    });
  }
}
