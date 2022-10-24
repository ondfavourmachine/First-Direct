import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateAnInvoice, GetInvoiceModel, CreateInvoiceResponse, GeneralGetResponses, FailedResponse } from 'src/app/core/models/scm/invoices.model';
import { environment } from 'src/environments/environment';


const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  createInvoice(data: Partial<CreateAnInvoice>): Observable<CreateInvoiceResponse> {
    return this.http.post<CreateInvoiceResponse>(`${environment.invoicesApiUrl}${environment.invoiceApi.addInvoice}`, data, httpOptions);
  }

  getInvoice(data: Partial<GetInvoiceModel>): Observable<GetInvoiceModel>{
    return this.http.post<GetInvoiceModel>(`${environment.invoicesApiUrl}${environment.invoiceApi.getAnInvoice}`, data, httpOptions)
  }

  getAllSubsidiaryInvoice(data: Partial<GetInvoiceModel>): Observable<GeneralGetResponses<CreateAnInvoice[]>>{
    return this.http.post<GeneralGetResponses<CreateAnInvoice[]>>(`${environment.invoicesApiUrl}${environment.invoiceApi.getSubsidiaryInvoices}`, data, httpOptions)
  }

  deleteInvoice(data: Partial<GetInvoiceModel>): Observable<FailedResponse>{
    return this.http.patch<FailedResponse>(`${environment.invoicesApiUrl}${environment.invoiceApi.deleteInvoice}`, data, httpOptions)
  }

  
}

