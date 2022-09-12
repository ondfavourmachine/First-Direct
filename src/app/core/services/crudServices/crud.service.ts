import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
private headerTitle = new BehaviorSubject("Onboarding");
private tabNumber = new BehaviorSubject(1);
private role = new BehaviorSubject("");

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
