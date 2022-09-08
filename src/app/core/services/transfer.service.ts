import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(
    private http: HttpClient
  ) { }

  FetchLocalPayments(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/GetlocalPayment`, data)
  }
  MakeOnScreenBulk(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/MakeOnScreenBulkLocalPayment`, data)
  }
  GetPaymentMethod()
  {
    return this.http.get<any>(`${environment.devUrl.transService}Payment/GetPaymentMethod`)
  }
  GetPaymentType()
  {
    return this.http.get<any>(`${environment.devUrl.transService}Payment/GetPaymentType`)
  }
  InitiateBulk(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/MakeBulkPayment`, data)
  }
  BulkReport(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/GetBulkUploadReport`, data)
  }
  DownloadAll(data): Observable<Blob>
  {  
    return this.http.get(`${environment.devUrl.transService}Payment/DownloadBatchAll/${data.session}/${data.username}/${data.subsidiaryId}/${data.batchId}`, { responseType: 'blob' });
  }
  DownloadValid(data)
  {
    return this.http.get(`${environment.devUrl.transService}Payment/DownloadBatchValid/${data.session}/${data.username}/${data.subsidiaryId}/${data.batchId}`, { responseType: 'blob' });
  }
  DeleteBatch(data)
  {
    return this.http.get<any>(`${environment.devUrl.transService}Payment/DeleteBatch/${data.session}/${data.username}/${data.subsidiaryId}/${data.batchId}`)
  }
  DownloadInvalid(data)
  {
    return this.http.get(`${environment.devUrl.transService}Payment/DownloadBatchInvalid/${data.session}/${data.username}/${data.subsidiaryId}/${data.batchId}`, { responseType: 'blob' });
  }
  ViewBatchValid(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/ViewBatchValid`, data)
  }
  InitiateBatch(data)
  { 
    return this.http.post<any>(`${environment.devUrl.transService}Payment/InitiateBatch`, data)
  }
  FetchSinglePaymentReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/SearchPaymentSingle`, data)
  }
  FetchBulkPaymentReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/SearchPaymentBulk`, data)
  }
  FetchBatchPaymentReports(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/SearchPaymentBulkH2H`, data) 
  }
  ApproveSinglePayments(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/ApprovePaymentLocal`, data)
  }
  ApproveMultipleBatch(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/ApproveMultipleBatch`, data)
  }
  GetBulkList(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/GetPayApproveLocalSingle`, data)
  }

  GetH2HList(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/GetPayApproveLocalSingleH2H`, data)
  }

  InitiateByLine(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/InitiateBatch`, data)
  }
  getCharges(data)
  { 
    return this.http.post<any>(`${environment.devUrl.transService}Payment/GetPaymentCharges`, data)
  }
  ViewNameMisMatch(data)
  { 
    return this.http.post<any>(`${environment.devUrl.transService}Payment/ViewNameMisMatch`, data)
  }
  MarkValid(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/MarkAsValid`, data)
  }
  markIdValid(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/MarkAsValidList`, data)
  }
  FetchApprovalHistory(id,payment)
  {
    return this.http.get(`${environment.devUrl.transService}Payment/GetApprovalHistory/${id}/${payment}`);
  }
  cancelFutureSingle(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/CancelFuturePayment`, data) 
  }
  cancelFutureBulk(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/CancelFutureBulkPayment`, data) 
  }

}
