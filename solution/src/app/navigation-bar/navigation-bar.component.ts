import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { GithubService } from '../shared/services/github.service';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  userProfile: User;
  userSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private githubService: GithubService
    ) {
      this.userSubscription = this.githubService.currentUser.subscribe(x => this.userProfile = x);
    }

    ngOnInit(): void {
      this.githubService.getUserProfile('erossignon');
    }

    ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
    }
}
