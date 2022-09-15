import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
export class CustomersService {

  constructor(
    private http: HttpClient
  ) { }

  getAllCustomers(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer`, httpOptions);
  };

  getCustomerById(id: number): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer/${id}`, httpOptions);
  };

  addBuyer(buyer: any): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/Customer/buyer`, buyer, httpOptions);
  };

  addSupplier(supplier: any): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/Customer/supplier`, supplier, httpOptions);
  };

  updateBuyer(buyer: any): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/Customer/save-buyer`, buyer, httpOptions);
  };

  updateSupplier(supplier: any): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/Customer/save-supplier`, supplier, httpOptions);
  };

  getBuyers(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer/buyer`, httpOptions);
  };

  getSuppliers(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer/supplier`, httpOptions);
  };

  getCustomerCategories(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/CustomerLookup/customer-categories`, httpOptions);
  };

  getCustomerIndustries(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/CustomerLookup/customer-industries`, httpOptions);
  };

  getCustomerTiers(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/CustomerLookup/customer-tiers`, httpOptions);
  };
}
