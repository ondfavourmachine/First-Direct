import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { userData } from '../models/userData.model';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  GetAlertPreferences(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/GetAlertPreference`, data)   
  }
  ChangeAlertPreference(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/SetPreference`, data)   
  }
  GetUsers(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/GetUsersforCompany`, data) 
  }
  GetUserRoles()
  {
      return this.http.get<any>(`${environment.devUrl.authService}Onboarding/GetUserRole`)
  }
  CreateNewUser(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/AddNewUser`, data)  
  }
  ChangeUserStatus(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/ChangeActiveUser`, data)  
  }
  UpdateUser(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/UpdateUser`, data)  
  }
  GetSubsidiaries(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/GetAllSubsidiaries`, data)  
  }
  UpdateDailyLimit(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/SetDailyLimit`, data)  
  }
  SubsidairyStatus(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Settings/ChangeSubsidiaryStatus`, data)  
  }
  ChangeMask(data)
  { 
    return this.http.post<any>(`${environment.devUrl.transService}Payment/MaskAccountBalance`, data)
  }
}