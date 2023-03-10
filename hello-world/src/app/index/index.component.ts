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
      next: (data: any) => console.log('Data', data),
      error: (err: any) => console.log('Error', err),
    });
  }
}
