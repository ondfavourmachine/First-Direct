import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient
  ) { }

  getCorpReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/CorpReports`, data)   
  }
  getSuspenseReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/CorpSuspenseReports`, data)   
  }
  getNEFTReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/NEFTReports`, data)   
  }
  getRTGSReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/RTGSReports`, data)   
  }
  getUploadReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/UploadReports`, data)   
  }
  getTransReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/TransactionReports`, data)   
  }
  getBatchDetails(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/GetBatchDetails`, data)   
  }

  getReversalReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Reports/ReversalReport`, data)   
  }
}