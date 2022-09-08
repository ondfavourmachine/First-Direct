import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PappsService {

  constructor(
    private http: HttpClient
  ) { }


  
  MakePAPPS(data)
  {
    return this.http.post<any>(`${environment.devUrl.papsUrl}Payment/MakeOnScreenPAPSSPayment`,data)
  }

  fetchPappsBank()
  {
    return this.http.get<any>(`${environment.devUrl.papsUrl}PapssPayment/GetPapssBanks`)
  }

  fetchRate(data:any)
  {
    return this.http.post<any>(`${environment.devUrl.papsUrl}PapssPayment/GetRate`,data)
  }

  fetchChargesPapps(data:any)
  {
    return this.http.post<any>(`${environment.devUrl.papsUrl}PapssPayment/Charges`,data)
  }

  confirmPappsTransaction(data)
  {
    return this.http.post<any>(`${environment.devUrl.papsUrl}PapssPayment/ConfirmTransaction`,data)
  }
  fetchPaymentList(data)
  {
    return this.http.post<any>(`${environment.devUrl.papsUrl}Payment/SearchPaymentPapss`,data)
  }
  FetchLocalPayments(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/GetlocalPayment`, data)
  }
  ApprovePAPSS(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/ApprovePaymentPAPSS`, data)
  }


}
