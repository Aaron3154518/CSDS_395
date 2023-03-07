import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    if (!window.opener) {
      this.router.navigate(['/']);
    }

    let code = this.route.snapshot.queryParams['code'];
    if (!code) {
      this.spotifyService.login();
    } else {
      (<Window>window.opener).postMessage(code, 'http://localhost:4200');
      window.close();
    }
  }

  login() {
    this.spotifyService.login();
  }
}
