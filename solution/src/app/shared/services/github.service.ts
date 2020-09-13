import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Repository } from '../models/repository';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getUserProfile(username: string): any {
    return this.http.get<User>(`https://api.github.com/users/${username}`).subscribe(userData => {
      this.currentUserSubject.next(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    });
  }

  getUserRepo(username: string): any {
    return this.http.get<User>(`https://api.github.com/users/${username}/repos`);
  }

}
