// import { Injectable } from '@angular/core';
// import { HttpHeaders, HttpClient, HttpResponse, HttpParams, HttpEventType, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// import { JwtService } from './jwt.service';
// // import { NotifierService } from 'angular-notifier';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   constructor(private http: HttpClient, private jwtService: JwtService) { }

//   get(path: string, params: any = {}): Observable<any> {
//     return this.http.get(`${environment.apiBaseUrl}${path}`, { headers: this.setHeaders(), params: params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   put(path: string, body: any = {}): Observable<any> {
//     return this.http.put(`${environment.apiBaseUrl}${path}`, body, { headers: this.setHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   post(path: string, body: any = {}): Observable<any> {
//     return this.http.post(`${environment.apiBaseUrl}${path}`, body, { headers: this.setHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   patch(path: string, body: any = {}): Observable<any> {
//     return this.http.patch(`${environment.apiBaseUrl}${path}`, body, { headers: this.setHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   delete(path: string): Observable<any> {
//     return this.http.delete(`${environment.apiBaseUrl}${path}`, { headers: this.setHeaders() })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   postFile(path: string, body: any = {}): Observable<any> {

//     // weird typings bug saying observe Type 'string' is not assignable to type '"body"'
//     const options = { headers: {}, reportProgress: true/* , observe: 'events' as 'events' */ };
//     if (this.jwtService.getToken()) {
//       options.headers = { authorization: `Bearer ${this.jwtService.getToken()}` };
//     }

//     return this.http.post(`${environment.apiBaseUrl}${path}`, body, options)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   private setHeaders(): HttpHeaders {
//     const headersConfig = {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       Authorization: ''
//     };

//     if (this.jwtService.getToken()) {
//       headersConfig.Authorization = `Bearer ${this.jwtService.getToken()}`;
//     }
//     return new HttpHeaders(headersConfig);
//   }

//   private handleError = (err: HttpErrorResponse) => {

//     switch (err.status) {
//       case 401:
//         // this.notifier.notify('warning', 'Your session is no longer valid.');
//         break;
//       case 403:
//         // this.notifier.notify('warning', 'You are not authorised');
//         break;
//       case 404:
//         // this.notifier.notify('warning', 'Resource not found');
//         break;

//       default:
//         console.error('An API error occurred...', err);
//         // this.notifier.notify('error', 'An error occured');
//         break;
//     }
//     return throwError(err);
//   };
// }
