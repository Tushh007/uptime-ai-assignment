import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GithubService } from '../shared/services/github.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit, OnDestroy {
  userProfile: User;
  userSubscription: Subscription;
  userRepoData = [];

  dataSource: any;
  displayedColumns: string[] = ['url'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private githubService: GithubService) {
    this.userSubscription = this.githubService.currentUser.subscribe(x => {
      this.userProfile = x;
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
