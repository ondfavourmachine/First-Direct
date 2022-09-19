import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { addCustomer, editCustomer, uploadCustomerFileModel, validateBankDetailsModel, } from 'src/app/core/models/scm/onboarding.model';
import { GlobalsService } from 'src/app/core/globals/globals.service';
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
    private http: HttpClient,
    private globals: GlobalsService
  ) { }

  // getAllCustomers(SearchQuery: string, PageNumber: number, PageSize: number): Observable<any> {
  //   return this.http.get(`${environment.scmApiUrl}/api/Customer?searchQuery=${SearchQuery}&pageNumber=${PageNumber}&pageSize=${PageSize}`, httpOptions);
  // };

  getAllCustomers(SearchQuery: string,SortColumn: string, PageNumber: number, PageSize: number ): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer?searchQuery=${SearchQuery}&SortColumn=${SortColumn}&pageNumber=${PageNumber}&pageSize=${PageSize}`, httpOptions);
  };

  getAllDefCustomers(): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer`, httpOptions);
  };

  getCustomerById(id: number): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer/${id}`, httpOptions);
  };

  addBuyer(buyer: addCustomer): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/Customer/buyer`, buyer, httpOptions);
  };

  addSupplier(supplier: addCustomer): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/Customer/supplier`, supplier, httpOptions);
  };

  updateBuyer(buyer: addCustomer): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/Customer/save-buyer`, buyer, httpOptions);
  };
  updateCustomer(buyer: editCustomer): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/Customer/modify-customer`, buyer, httpOptions);
  };

  updateSupplier(supplier: addCustomer): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/Customer/save-supplier`, supplier, httpOptions);
  };

  getBuyers(SearchQuery: string, PageNumber: number, PageSize: number): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer/buyer?searchQuery=${SearchQuery}&pageNumber=${PageNumber}&pageSize=${PageSize}`, httpOptions);
  };

  getSuppliers(SearchQuery: string, PageNumber: number, PageSize: number): Observable<any> {
    return this.http.get(`${environment.scmApiUrl}/api/Customer/supplier?searchQuery=${SearchQuery}&pageNumber=${PageNumber}&pageSize=${PageSize}`, httpOptions);
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

  uploadCustomerFile(payload: uploadCustomerFileModel, customerType: string): Observable<any> {
    return this.http.post(`${environment.scmApiUrl}/api/Customer/${customerType}/bulk-upload`, payload, httpOptions);
  }

  deletteCustomer(id: number): Observable<any> {
    return this.http.patch(`${environment.scmApiUrl}/api/Customer/customer/${id}`, httpOptions);
  };

  // fbn api

  getAllBanks(): Observable<any> {
    return this.http.get(`${environment.bankDetailsVerificationApiUrl}/GetAllBanks`, httpOptions);
  };

  verifyBankDetails(payload: validateBankDetailsModel): Observable<any> {
    return this.http.post(`${environment.bankDetailsVerificationApiUrl}/ValidateAccountNumber`, payload, httpOptions);
  };

  getSessions() {
    const userLoad = JSON.parse(this.globals.DecryptData(sessionStorage.getItem('plomk')))
    console.log(userLoad.session)
    return userLoad.session;
  }

  uploadBuyerFile(payLoad: any){
    return this.http.post(`${environment.scmApiUrl}/api/Customer/bulk-buyer`, payLoad, httpOptions);
  }

  uploadSupplierFile(payLoad: any){
    return this.http.post(`${environment.scmApiUrl}/api/Customer/bulk-supplier`, payLoad, httpOptions);
  }





  //     getCustomerById(id: number): Observable<any> {
  //     return this.http.get(`${environment.scmApiUrl}/api/Customer/${id}`, httpOptions);
  //   }
  // }
}