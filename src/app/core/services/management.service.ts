import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(
    private http: HttpClient
  ) { }

    FetchAccounts(data)
    {  
     return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetAccountsPaged`, data)
    }
    FetchRates(data)
    {  
     return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetExchangeRate`, data)
    }
    FetchHistory(data)
    {  
     return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetTransactionHistory`, data)
    }
    ///api/AccountCenter/TransStatement/{username}/{Accountid}/{startdate}/{enddate}
    // GenerateStatemnet(data)
    // {  
    //  return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/TransStatement/`, data)
    // }
    getPDF(data): Observable<Blob> {   
      // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
      return this.http.get(`${environment.devUrl.authService}AccountCenter/TransStatement/${data.username}/${data.accountId}/${data.startDate}/${data.endDate}`, { responseType: 'blob' });
    }
    checkSize(data)
    {
      return this.http.get<any>(`${environment.devUrl.authService}AccountCenter/CheckStatementSize/${data.username}/${data.accountId}/${data.startDate}/${data.endDate}` )
    }
    SetDefaultAccount(data)
    {
      return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/SetPrimaryAccount`, data)
    }
}
