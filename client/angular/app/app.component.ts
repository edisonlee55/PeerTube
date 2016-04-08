import { Component, ElementRef } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';

import { VideosAddComponent } from '../videos/components/add/videos-add.component';
import { VideosListComponent } from '../videos/components/list/videos-list.component';
import { VideosWatchComponent } from '../videos/components/watch/videos-watch.component';
import { VideosService } from '../videos/services/videos.service';
import { FriendsService } from '../friends/services/friends.service';
import { UserLoginComponent } from '../users/components/login/login.component';
import { AuthService } from '../users/services/auth.service';
import { AuthStatus } from '../users/models/authStatus';

@RouteConfig([
  {
    path: '/users/login',
    name: 'UserLogin',
    component: UserLoginComponent
  },
  {
    path: '/videos/list',
    name: 'VideosList',
    component: VideosListComponent,
    useAsDefault: true
  },
  {
    path: '/videos/watch/:id',
    name: 'VideosWatch',
    component: VideosWatchComponent
  },
  {
    path: '/videos/add',
    name: 'VideosAdd',
    component: VideosAddComponent
  }
])

@Component({
    selector: 'my-app',
    templateUrl: 'app/angular/app/app.component.html',
    styleUrls: [ 'app/angular/app/app.component.css' ],
    directives: [ ROUTER_DIRECTIVES ],
    providers: [ ROUTER_PROVIDERS, HTTP_PROVIDERS,
                 ElementRef, VideosService, FriendsService,
                 AuthService
               ]
})

export class AppComponent {
  isLoggedIn: boolean;

  constructor(private _friendsService: FriendsService,
              private _authService: AuthService,
              private _router: Router
  ) {
    if (localStorage.getItem('access_token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this._authService.loginChanged$.subscribe(
      status => {
        if (status === AuthStatus.LoggedIn) {
          this.isLoggedIn = true;
        }
      }
    );
  }

  doSearch(search: string) {
    if (search !== '') {
      this._router.navigate(['VideosList', { search: search }]);
    } else {
      this._router.navigate(['VideosList']);
    }
  }

  logout() {
    // this._authService.logout();
  }

  makeFriends() {
    this._friendsService.makeFriends().subscribe(
      status => {
        if (status === 409) {
          alert('Already made friends!');
        } else {
          alert('Made friends!');
        }
      },
      error => alert(error)
    );
  }

  quitFriends() {
    this._friendsService.quitFriends().subscribe(
      status => {
          alert('Quit friends!');
      },
      error => alert(error)
    );
  }
}
