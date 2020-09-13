import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user';
import { GithubService } from '../shared/services/github.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  userProfile: User;
  userSubscription: Subscription;

  constructor(private githubService: GithubService) {
    this.userSubscription = this.githubService.currentUser.subscribe(x => this.userProfile = x);
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
