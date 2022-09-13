import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
   "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': 'true',
  }),
};
@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient
  ) { }

  getAllCustomers(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer`, httpOptions)
  }
}
