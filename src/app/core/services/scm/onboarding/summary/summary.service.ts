import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { userRoleModel } from 'src/app/core/models/scm/onboarding.model';
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
export class SummaryService {

  constructor(
    private http: HttpClient
  ) { }

  getOnboardStats(reqBody: userRoleModel): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/Customer/GetSummary`, reqBody, httpOptions);
  }
}
