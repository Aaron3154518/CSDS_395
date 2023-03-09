import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongComponent } from './song/song.component';
import { IndexComponent } from './index/index.component';
import { RecommenderComponent } from './recommender/recommender.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'playlists', component: SongListComponent },
  { path: 'song/:id', component: SongComponent },
  { path: 'recommender', component: RecommenderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
