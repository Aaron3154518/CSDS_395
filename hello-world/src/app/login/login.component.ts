import { Component } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private spotifyService: SpotifyService) {
  }

  login() {
    this.spotifyService.login('http://127.0.0.1:4200/main');
  }
}
