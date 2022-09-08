import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  constructor(
    private http: HttpClient
  ) { }

  FetchLocalBeneficiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Beneficiary/GetlocalBeneficiary`, data)
  }
  DeleteBeneficiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Beneficiary/DeleteBeneficiary`, data)
  }
  AddBeneficiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Beneficiary/AddLocalBeneficiary`, data)
  }
  ApproveBeneficiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Beneficiary/ApproveBeneficiary`, data)
  }
  FetchPendingBeneficiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Beneficiary/GetPendingLocalBeneficiary`, data)
  }
  GetAllBanks()
  {
    return this.http.get<any>(`${environment.devUrl.transService}Payment/GetAllBanks`)
  }
  ValidateAccount(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Payment/ValidateAccountNumber`, data)   
  }
  UploadBeneficiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.transService}Beneficiary/UploadBeneficiary`, data)
  }
}
