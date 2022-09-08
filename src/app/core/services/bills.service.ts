import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

// const url2 = environment.devUrl.collectionService2;
const dangoteUrl = 'https://192.168.253.129:9445/api/';
const bet9jaUrl = 'https://192.168.253.129:6068/api/';
@Injectable({
  providedIn: "root",
})
export class BillsService {
  constructor(private http: HttpClient) {}

  FetchRrrDetatils(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Remita/GetRrrDetails`,
      data
    );
  }

  InitiateRrrTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Remita/InitiateRrrTransaction`,
      data
    );
  }

  FetchBillerCategories(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Quickteller/GetBillerCategories`,
      data
    );
  }

  FetchBillers(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Quickteller/GetBillers`,
      data
    );
  }

  FetchProducts(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Quickteller/GetProducts`,
      data
    );
  }

  FetchProductForm(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Remita/GetProductForm`,
      data
    );
  }

  ValidateRequest(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Remita/ValidateRequest`,
      data
    );
  }

  InitiateTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Remita/InitiateTransaction`,
      data
    );
  }

  InitiateQTTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}QuickTeller/InitiateTransaction`,
      data
    );
  }

  //Ebills Pay
  FetchEbillsBillers(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}eBillsPay/GetBillers`,
      data
    );
  }

  FetchEbillsProduct(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}eBillsPay/GetProductsByBiller`,
      data
    );
  }

  InitiateEbillsTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}eBillsPay/InitiateTransaction`,
      data
    );
  }

  // Ogswc Payment
  FetchOgswcDetatils(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Ogswc/VerifyCustomer`,
      data
    );
  }

  InitiateOgswcTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Ogswc/InitiateTransaction`,
      data
    );
  }

  FetchSchemeFee(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}Collection/GetSchemeFee`,
      data
    );
  }

  // E-Cashier
  FetchMerchants(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/GetAvailableMerchants`,
      data
    );
  }

  FetchMerchantItems(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/GetMerchantPaymentItems`,
      data
    );
  }

  FetchPaymentOptions(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/GetPaymentOptions`,
      data
    );
  }

  FetchPaymentOptionsItems(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/GetPaymentOptionItems`,
      data
    );
  }

  FetchPostTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/PostTransaction`,
      data
    );
  }

  InitiateEcashierTransaction(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/InitiateTransaction`,
      data
    );
  }

  FetchTaxOffices(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService}ECashier/GetTaxOffices`,
      data
    );
  }

  // Virtual Accounts
  FetchDynamicTypes(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/GetDynamicTypes`,
      data
    );
  }

  FetchAccountTypes(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/GetAccountTypes`,
      data
    );
  }

  CreateorUpdate(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/ReserveOrUpdate`,
      data
    );
  }

  FetchAllReservations(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/FetchAllReservations`,
      data
    );
  }

  FetchReservation(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/FetchReservation`,
      data
    );
  }

  FetchUnapprovedReservation(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/FetchUnapprovedReservation`,
      data
    );
  }

  FetchAllUnapprovedReservations(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/FetchAllUnapprovedReservations`,
      data
    );
  }

  CancelReservation(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/CancelReservation`,
      data
    );
  }

  ApproveReservation(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/ApproveReservation`,
      data
    );
  }

  RejectReservation(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/RejectReservation`,
      data
    );
  }

  FetchSubsidiaryTransactions(data) {
    return this.http.post<any>(
      `${environment.devUrl.collectionService2}VirtualAccount/SubsidiaryTransactions`,
      data
    );
  }

  UploadData(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService2}VirtualAccount/ReserveBulk`, data)
  }
  GetDangoteMenu()
  {
    return this.http.get<any>(`${dangoteUrl}DangoteNonCement/GetDangoteMenu`)
  }
  GetProductList()
  {
    return this.http.get<any>(`${dangoteUrl}DangoteNonCement/GetDangoteProduct`)
  }
  FetchCustomerDetails(data)
  {
    return this.http.post<any>(`${dangoteUrl}DangoteNonCement/GetCustomerDetail`, data)
  }
  InitiateDangotePay(data)
  {
    return this.http.post<any>(`${dangoteUrl}DangoteNonCement/InitiateDangoteNonCementTransaction`, data)
  }
  FetchBet9jaDetails(data)
  {
    return this.http.get<any>(`${bet9jaUrl}Bet9ja/CustomerValidation?clientId=${data}`)
  }
  InitiateBet9ja(data)
  {
    return this.http.post<any>(`${bet9jaUrl}Bet9ja/InitiateBet9jaTransaction`, data)
  }
}
