import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }


  login(data) {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/Login_Old`, data);
  }
  verifyToken(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/LoginToken`, data);
  }
  userLogout(Username, Session)
  {
    return this.http.get<any>(`${environment.devUrl.authService}Authentication/Logout/${Username}/${Session}`)
  }

  RetrieveUsername(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/ForgotUsername`, data);
  }
  InitiatePasswordChange(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/ForgotPassword`, data);
  }
  ResetPassword(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/ChangePassword`, data);
  }
  GetSubsidiary(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/GetSubsidiaryInfo`, data);
  }
  GetAds(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Advert/GetAdvert`, data);
  }
  SubmitAd(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Advert/SubmitAdvert`, data);
  }
  GetIp()
  {
    return this.http.get<any>('https://jsonip.com')
  }
  RegisterCompany(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Onboarding/StartRegistration`, data)
  }
  ValidateAccounts(data)
  {
    return this.http.get<any>(`${environment.devUrl.authService}Onboarding/GetAccountInfo/${data}`)
  }
  GetNotifications(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Notification/GetAllNotifications`, data)
  }
  GetNewNotifications(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Notification/GetNewNotifications`, data)
  }
  AddFeedback(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}FeedBack/AddCustomerFeedback`, data)
  }
  GetSecretQuestions(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/GetSecretQuestion`, data)
  }
  SubmitQuestions(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Authentication/SetSecretQuestion`, data)
  }

  confirmAccount(data)
  {
    return this.http.get<any>(`${environment.devUrl.authService}Onboarding/GetAccountInfo/${data}`)
  }
  validateCode(data)
  {
    return this.http.get<any>(`${environment.devUrl.authService}Onboarding/ValidateCode/${data}`)
  }
  GetRoles()
  {
    return this.http.get<any>(`${environment.devUrl.authService}Onboarding/GetUserRole`)
  }

  SubmitReg(data)
  {
    return this.http.post<any>(`${environment.devUrl.authService}Onboarding/CompleteOnboarding`, data)
  }
  
  GetOTP(data)
  {
    return this.http.get<any>(`${environment.devUrl.authService}Onboarding/GenerateValidationCode/${data}`)
  }
  
  DownloadForm(data): Observable<Blob> {   
    // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    return this.http.get(`${environment.devUrl.authService}Onboarding/DownloadPdf/${data}`, { responseType: 'blob' });
  }

  resendCode(data){
    return this.http.get<any>(`${environment.devUrl.authService}Onboarding/ResendValidationCode/${data}`)
  }
}