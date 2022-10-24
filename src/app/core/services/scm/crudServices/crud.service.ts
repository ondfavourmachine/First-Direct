import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { addLpoModel } from 'src/app/core/models/scm/LPO.model';
import { addCustomer, uploadCustomerFileModel } from 'src/app/core/models/scm/onboarding.model';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
private headerTitle = new BehaviorSubject("Onboarding");
private tabNumber = new BehaviorSubject(1);
private role = new BehaviorSubject("");
private customerDetails = new BehaviorSubject<addCustomer>(null);
private customerFileDetails = new BehaviorSubject<any>(null);
private editor = new BehaviorSubject<any>("");
private lpoRequest = new BehaviorSubject<addLpoModel>(null);
private lpoTabNumnber = new BehaviorSubject(1);
private lpoHeaderTitle = new BehaviorSubject("Purchase Order");


updateLpoHeaderTitle(title: string){
  this.lpoHeaderTitle.next(title)
}

getLpoHeaderTitle(): BehaviorSubject<string>{
  return this.lpoHeaderTitle
}

updateLpoTabNumber(num: number){
  this.lpoTabNumnber.next(num)
}

getLpoTabNumber(): BehaviorSubject<number>{
  return this.lpoTabNumnber
}

updateLpoRequest(lpo: addLpoModel){
  this.lpoRequest.next(lpo)
}

getLpoRequest(): BehaviorSubject<addLpoModel>{
  return this.lpoRequest
}


updateEditor(editor: any){
  this.editor.next(editor)
}

getEditor(): BehaviorSubject<any>{
  return this.editor
}

updateCustomerFileDetails(details: any){
  this.customerFileDetails.next(details)
}

getCustomerFileDetails(): BehaviorSubject<any>{
  return this.customerFileDetails
}


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
