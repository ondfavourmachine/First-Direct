import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { requestLpoBody, addLpoModel, updatingLpoModel, downloadLpoModel } from 'src/app/core/models/scm/LPO.model';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LposService {

  constructor(
    private http: HttpClient
  ) { }

  getLpos(reqBody: requestLpoBody): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/PurchaseOrder/GetPurchaseOrder`, reqBody);
  }

  addLpo(lpo: addLpoModel): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/PurchaseOrder/AddPurchaseOrder`, lpo);
  }

  getLpoById(id: number): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/PurchaseOrder/${id}`);
  }

  acceptLpo(reqBody: updatingLpoModel): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/PurchaseOrder/AcceptPurchaseOrder`, reqBody);
  }

  rejectLpo(reqBody: updatingLpoModel): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/PurchaseOrder/RejectPurchaseOrder`, reqBody);
  }

  deleteLpo(reqBody: updatingLpoModel): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/PurchaseOrder/DeletePurchaseOrder`, reqBody);
  }

  dowloadLpo(reqBody: downloadLpoModel): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/PurchaseOrder/DownloadPurchaseOrderDocument`, reqBody);
  }
}
