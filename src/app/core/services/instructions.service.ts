import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstructionService {

  constructor(
    private http: HttpClient
  ) { }

 GetLocalPayment(data)
 {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/GetlocalPayment`, data)
 }
 GetFrequency()
 {
   return this.http.get<any>(`${environment.devUrl.transService}StandingInstruction/GetSIFrequency`)
 }
createSI(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/MakeStandingInstruction`, data)
  }
  FetchPendingSI(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/ViewPendingStandingInstruction`, data)
  }
  ApproveSI(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/ApproveSI`, data)
  }
  FetchSI(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/ViewStandingInstruction`, data)
  }
  FetchSingleSI(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/ViewSIPayments`, data)
  }
  ChangeSIStatus(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}StandingInstruction/ChangeStatusSI`, data)
  }
}
