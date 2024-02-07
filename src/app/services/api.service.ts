import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Repository {
  id: number;
  name: string;
}

interface Tag {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private searchSubject = new BehaviorSubject<string>(this.getStoredSearchTerm() || 'sameer0288');
  private total_pages = new BehaviorSubject<number>(0);
  private curr_page = new BehaviorSubject<number>(1);
  private repositories = new BehaviorSubject<Repository[]>([]);

  constructor(private httpClient: HttpClient) {}

  setRepositories(repositories: Repository[]) {
    this.repositories.next(repositories);
  }

  getRepositories(): Observable<Repository[]> {
    return this.repositories.asObservable();
  }

  private getStoredSearchTerm(): string {
    return localStorage.getItem('searchTerm') || '';
  }

  setCurrPage(curr_page: number) {
    this.curr_page.next(curr_page);
  }

  getCurrPage(): Observable<number> {
    return this.curr_page.asObservable();
  }

  setSearchTerm(term: string) {
    localStorage.setItem('searchTerm', term);
    this.searchSubject.next(term);
  }

  getSearchTerm(): Observable<string> {
    return this.searchSubject.asObservable();
  }

  setTotalPages(total_pages: number) {
    this.total_pages.next(total_pages);
  }

  getTotalPages(): Observable<number> {
    return this.total_pages.asObservable();
  }

  getUser(): Observable<any> {
    return this.httpClient.get(`https://api.github.com/users/${this.searchSubject.value}`);
  }

  getRepos(): Observable<Repository[]> {
    const apiUrl = `https://api.github.com/users/${this.searchSubject.value}/repos`;
    const params = new HttpParams()
      .set('page', this.curr_page.value.toString())
      .set('per_page', '8');

    return this.httpClient.get<Repository[]>(apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching repositories:', error);
        return throwError(error);
      })
    );
  }

 getLanguages(url: string): Observable<Tag[]> {
  const headers = new HttpHeaders({
    Authorization: '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'
  });

  return this.httpClient.get<Tag[]>(url, { headers }).pipe(
    catchError((error) => {
      console.error('Error fetching languages:', error);
      return throwError(error);
    })
  );
}
}
