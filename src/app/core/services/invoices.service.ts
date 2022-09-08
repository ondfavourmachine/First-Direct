import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(private http: HttpClient) { }

  GetInvoiceTypes(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/GetInvoiceTypes`, data)
  }

  GetInvoiceSchedules(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/GetScheduleTypes`, data)
  }

  GetInvoiceCategories(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/GetInvoiceCategories`, data)
  }

  GetAllInvoices(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/FetchAll`, data)
  }

  FetchInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/Fetch`, data)
  }

  CancelInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/Cancel`, data)
  }

  MarkAsPaidInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/MarkAsPaid`, data)
  }

  ReplicateInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/Replicate`, data)
  }

  GetInvoiceByEmail(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/GetInvoiceByEmail`, data)
  }

  SendReminder(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/SendReminder`, data)
  }

  DeleteInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/Delete`, data)
  }

  GetEmailDetails(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/GetDetailsByEmail`, data)
  }

  CreateInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/CreateorUpdate`, data)
  }

  FetchUnapprovedInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/FetchAllUnapproved`, data)
  }

  FetchUnapproved(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/FetchUnapproved`, data)
  }

  ApproveInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/Approve`, data)
  }

  RejectInvoice(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/Reject`, data)
  }

  FetchInvoiceClientDetails(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/ClientPayment/GetInvoiceDetails`, data)
  }

  FetchInvoiceOnlineDetails(data) {
    return this.http.get<any>(`${environment.devUrl.collectionService}Invoice/OnlinePayment/GetInvoiceDetails/${data.retrievalReference}`)
  }

  InitiateClientPayment(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/ClientPayment/InitiateTransaction`, data)
  }

  InitiateOnlinePayment(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/OnlinePayment/InitiateTransaction`, data)
  }

  GetSchemeFee(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Collection/GetSchemeFee`, data)
  }

  FetchTransactionHistory(data) {
    return this.http.post<any>(`${environment.devUrl.collectionService}Invoice/SubsidiaryTransactions`, data)
  }
}
