import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@bludger/api-interfaces';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelloService {

  constructor(private http: HttpClient) { }

  getHello(): Observable<Message> {
    return this.http.get<Message>(`${environment.apiBaseUrl}/hello`);
  }
}
