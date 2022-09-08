import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForeignService {

  constructor(
    private http: HttpClient
  ) { }

    GetForeignPayments(data)
    {
        return this.http.post<any>(`${environment.devUrl.transService}ForeignPayment/GetForeignPayment`, data)
    }

    validateAccount(data)
    {
      return this.http.post<any>(`${environment.devUrl.transService}Payment/ValidateAccountNumber`, data)
    }
    makePayment(data)
    {
      return this.http.post<any>(`${environment.devUrl.transService}ForeignPayment/MakeForeignPayment2`, data)
    }
    getList(data)
    {
      return this.http.post<any>(`${environment.devUrl.transService}ForeignPayment/SearchForeignPaymentSingle`, data)
    }

    approvePayment(data:any)
    {
      return this.http.post<any>(`${environment.devUrl.transService}ForeignPayment/ApproveForeignPayment`, data)
    }
    downloadDoc(data): Observable<Blob> {   
      // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
      return this.http.post(`${environment.devUrl.transService}ForeignPayment/DownloadSupportingDocument?id=${data}`,data ,{ responseType: 'blob' });
    }
    getCharges(data:any)
    {
      return this.http.get(`${environment.devUrl.transService}ForeignPayment/GetForeignCharges/${data.currency}/${data.amount}/${data.chargeBeneficiary}`)
    }
    getBIC(data)
    {
      return this.http.get(`${environment.devUrl.transService}ForeignPayment/GetBankBicByInstitution/${data.country}/${encodeURIComponent(data.institutionName)}`)
    }

}