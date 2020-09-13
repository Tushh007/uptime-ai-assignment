import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../shared/models/user';
import { GithubService } from '../shared/services/github.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  providers: [DatePipe]
})
export class OverviewComponent implements OnInit, OnDestroy {
  userProfile: User;
  userSubscription: Subscription;
  userRepoData = [];
  graphUrl: string;
  dataUrl: string;

  dataSource: any;
  displayedColumns: string[] = ['url'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private githubService: GithubService, private datePipe: DatePipe) {
    this.userSubscription = this.githubService.currentUser.subscribe(x => {
      this.userProfile = x;
      this.dataUrl = '/' + this.userProfile.login;
      this.graphUrl = `/users/${this.userProfile.login}/contributions?to=${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}`;
      this.getRepos(this.userProfile.login);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRepos(username: string): void {
    this.githubService.getUserRepo(username)
      .pipe(first())
      .subscribe(
        userRepoData => {
          this.userRepoData = userRepoData;
          console.log(this.userRepoData);
          this.dataSource = new MatTableDataSource(this.userRepoData);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          // console.log(error);
        });
  }


}
