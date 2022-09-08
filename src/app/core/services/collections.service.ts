import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// const url = 'https://fapxplus-collection-api-dev.fbn-devops-dev-asenv.appserviceenvironment.net/api/CollectionOnline/InitiateTransaction'
const url = 'https://192.168.253.129/tesla_collection/api/';


@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private http: HttpClient) { }


  //Forms

  UploadData(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/UploadItems`, data)
  }

  FetchCurrencies(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetCurrencies`, data)
  }

  LoadFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/LoadFields`, data)
  }

  LoadSystemFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/LoadSystemProperties`, data)
  }

  FetchListItems(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetListItems`, data)
  }

  FetchSplitTypes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetSplitTypes`, data)
  }

  FetchBeneficiariesTypes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetBeneficiaryTypes`, data)
  }

  CreateCollectionForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/CreateorUpdate`, data)
  }

  FetchCollectionSingleForm(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/Fetch`, data)
  }

  AddCollectionFormsFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/AddField`, data)
  }

  UpdateCollectionFormsFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/UpdateFields`, data)
  }

  FetchCollectionFormsFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchFields`, data)
  }

  FetchSingleCollectionFormField(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchField`, data)
  }

  SaveCollectionFormsFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/UpdateFields`, data)
  }

  DeleteCollectionFormsFields(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/DeleteField`, data)
  }

  FetchCollectionForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchAll`, data)
  }

  FetchForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchAllNone`, data)
  }

  FetchApprovedForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchAllApproved`, data)
  }

  FetchUnapprovedForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchAllUnapproved`, data)
  }

  // FetchApprovedForms(data) {
  //   return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchAllApproved`, data)
  // }

  FetchUnapprovedSingleForm(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/FetchUnapproved`, data)
  }

  ApproveForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/ApproveForm`, data)
  }

  RejectForms(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/RejectForm`, data)
  }


  FetchSchemeTypes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetSchemeTypes`, data)
  }

  FetchControlTypes(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetControlTypes`, data)
  }

  FetchFieldTypes(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetFieldTypes`, data)
  }

  DeleteItems(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/DeleteItem`, data)
  }

  DeleteCollectionForm(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/Delete`, data)
  }

  AddItems(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/AddItem`, data)
  }

  GetItemsModel(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionForm/GetFormDataModel`, data)
    // return this.http.post<any>(`https://192.168.253.129/tesla_collection/api/CollectionForm/GetFormDataModel`, data)
    

  }



  //Collections

  FetchSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetSchemes`, data)
  }

  FetchUserAccounts(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetUserAccounts`, data)
  }

  FetchYTDPaymentChannel(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/FetchCollectionSummaryByPymtChannel`, data)
  }

  FetchYTDPeriod(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/FetchCollectionSummaryByPeriod`, data)
  }

  FetchCategories(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetCategories`, data)
  }

  FetchCustomCategories(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetCategories`, data)
  }

  FetchApprovedTransactions(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/ApproveTransactions`, data)
  }

  FetchApprovalStatus(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetApprovalStatus`, data)
  }

  ApproveTransactions(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/ApproveTransaction`, data)
  }

  RejectTransactions(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/RejectTransaction`, data)
  }

  FetchLookUp(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/DoLookUp`, data)
  }

  InitiateTransaction(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/InitiateTransaction`, data)
  }

  FetchSchemeById(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetScheme`, data)
  }

  FetchSchemeFee(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetSchemeFee`, data)
  }

  FetchPaymentStatus() {
    return this.http.get<any>(`${environment.devUrl.collectionService}Collection/GetPaymentStatus`)
  }

  FetchTransactionHistory(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/TransactionHistory`, data)
  }

  FetchTransactionDetails(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetTransactionDetails`, data)
  }

  FetchSubsidiaryTransaction(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/SubsidiaryTransactions`, data)
  }

  FetchReceipt(data)
  {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetReceiptDetails`, data)
  }




  // Schemes


  FetchBillerCode(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/GetBillerCode`, data)
  }

  FetchSettlementTypes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/GetSettlementTypes`, data)
  }

  FetchPaymentChannels(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/GetPaymentChannels`, data)
  }

  FetchCollectionSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchAll`, data)
  }

  FetchUnapprovedCollectionSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchAllUnapproved`, data)
  }

  CreateCollectionSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/CreateorUpdate`, data)
  }

  FetchAllCollectionScheme(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchAll`, data)
  }

  FetchCollectionSingleSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/Fetch`, data)
  }

  PublishSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/Publish`, data)
  }
 
  FetchDefaultCharges(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchDefaultCharges`, data)
  }

  FetchAccountName(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/GetAcctName`, data)
  }

  FetchBillers(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/GetBillers`, data)
  }

  FetchSchemeByBiller(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/GetSchemesByBiller`, data)
  }

  Approve(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/Approve`, data)
  }

  Reject(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/Reject`, data)
  }

  SendEmailLink(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/SendSchemeOnlineUrl`, data)
  }




  //Reports

  FetchAllReport(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchAllReport`, data)
  }

  FetchReport(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchReport`, data)
  }

  EnableReport(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/EnableReport`, data)
  }

  AddReport(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/AddReport`, data)
  }

  ReportTransactions(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/ReportTransactions`, data)
  }

  FetchAllReportLog(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/FetchAllReportLog`, data)
  }

  FetchSchemeReportViewModel(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/LoadSchemeReportViewModel`, data)
  }

  FetchSchemeReportsViewModel(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionScheme/LoadSchemeReportsViewModel`, data)
  }


  // Online Schemes

  FetchOnlineCategories() {
    return this.http.get<any>(`${environment.devUrl.collectionService}CollectionOnline/GetCategories`);
  }

  FetchOnlineSchemes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionOnline/GetSchemes`, data)
  }

  FetchOnlineScheme(data) {
    return this.http.get<any>(`${environment.devUrl.collectionService}CollectionOnline/GetScheme?id=${data}`)
  }

  FetchOnlineSchemeFee(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionOnline/GetSchemeFee`, data)
  }

  FetchApprovedOnlineTransactions(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/ApproveTransactions`, data)
  }

  InitiateOnlineTransactions(data) {
    return this.http.post<any>(`${url}CollectionOnline/InitiateTransaction`, data)
  }

  ApproveOnlineTransactions(data) {
    return this.http.post<any>(`${url}CollectionOnline/ApproveTransaction`, data)
  }

  RepostOnlineTransactions(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionOnline/RepostTransaction`, data)
  }

  FetchOnlineTransactionsDetails(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionOnline/GetTransactionDetails`, data)
  }

  GetOnlineApprovalStatus(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionOnline/GetApprovalStatus`, data)
  }

  GetOnlinePaymentStatus(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}CollectionOnline/GetPaymentStatus`, data)
  }

  GetPaymentStatus(data) {
    return this.http.get<any>(`${environment.devUrl.collectionService}CollectionOnline/GetTransactionStatus/${data}`)
  }


  GetReport(data) {
    return this.http.get<any>(`${environment.devUrl.collectionService}Collection/GetReceiptUrl/${data.session}/${data.username}/${data.subsidiaryId}/${data.id}`)
  }

  
}
