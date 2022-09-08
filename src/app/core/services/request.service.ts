import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient
  ) { }

  MakeChequeRequest(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/MakeChequeRequest`, data)   
  }

  StopCheque(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/StopCheque`, data)   
  }
  ConfirmCheque(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/ConfirmCheque`, data)   
  }
  GetIdType()
  {
    return this.http.get<any>(`${environment.devUrl.transService}ServiceRequest/GetIdType`)   
  }
  GetStopReason()
  {
    return this.http.get<any>(`${environment.devUrl.transService}ServiceRequest/GetStopChequeReason`)   
  }
  GetReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/GetServiceRequestReport`, data)   
  }
  GetPending(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/GetPendingServiceRequest`, data)   
  }

  GetBranches()
  {
    return this.http.get<any>(`${environment.devUrl.transService}ServiceRequest/GetBranches`)
  }

  fetchChequeTypes(data:any)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/GetChequTypes`,data)
  }

  ApproveCheckConfirmation(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}ServiceRequest/ApproveServiceRequest`, data)
  }
}