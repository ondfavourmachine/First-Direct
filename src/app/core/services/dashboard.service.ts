import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

    FetchAccounts(data)
    {  
     return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetAccountsPaged`, data)
    }

    FetchSummary(data)
    {  
     return this.http.post<any>(`${environment.devUrl.transService}Payment/GetPaymentDashboard`, data)
    }

    FetchRates(data)
    {  
     return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetExchangeRate`, data)
    }
    FetchHistory(data)
    {  
     return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetTransactionHistory`, data)
    }
    FetchPattern(data)
    {
      return this.http.post<any>(`${environment.devUrl.authService}AccountCenter/GetSpendPattern`, data)
    }
}
