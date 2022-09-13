import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { addCustomer } from 'src/app/core/models/scm/onboarding.model';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
private headerTitle = new BehaviorSubject("Onboarding");
private tabNumber = new BehaviorSubject(1);
private role = new BehaviorSubject("");
private customerDetails = new BehaviorSubject<addCustomer>(null);


updateCustomerDetails(details: addCustomer){
  this.customerDetails.next(details)
}

getCustomerDetails(): BehaviorSubject<addCustomer>{
  return this.customerDetails
}

updateHeaderTitle(title: string){
  this.headerTitle.next(title)
}

updateRole(role: string){
  this.role.next(role)
}

getHeaderTitle(): BehaviorSubject<string>{
  return this.headerTitle
}
getRole(): BehaviorSubject<string>{
  return this.role
}
updatetabNumber(num: number){
  this.tabNumber.next(num)
}

gettabNumber(): BehaviorSubject<number>{
  return this.tabNumber
}
  constructor() { }
}
