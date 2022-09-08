import { Component, OnInit } from '@angular/core';
import { ManagementService } from 'src/app/core/services/management.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { PaginationService } from 'src/app/core/classess/pagination';
import { userData } from 'src/app/core/models/userData.model';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: any;
  defId: any;
  selectedNumber: any;
  defaultAcc: any;
  transHistory: any;
  p:any;
  allHistory: any;
  FilterForm: FormGroup;
  allAccounts: any;
  checkedAcc = [];
  term:any;
  accountGroup: any;
  ReceiptItem: any;
  sizeOk: boolean;
  newArr: Array<any> = [];
  selectedCurrency: string;
  pg = 0;
  totalCount: any;
  pager:any = {};
  activePage = 1;
  userLoad:userData;
  constructor(
    private manage: ManagementService,
    public gVars: GlobalsService,
    private fb: FormBuilder,
    private paged: PaginationService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.GetAccounts()
    }, 1000);
    this.FilterForm = this.fb.group({
        startDate:['',Validators.required],
        endDate:['',Validators.required],
        dashboard:false,
        username:this.userLoad.username,
        session:this.userLoad.session,
        accountId:[''],
      })
  }
  GetAccounts()
  {
    this.gVars.spinner.show()
    let body ={
      ...this.userLoad,
      page: 0,
      recordPerPage: 6
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
   this.manage.FetchAccounts({encryptedData:newBody}).subscribe(
     res=>{
       let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
       console.log(decryptedData)
       if(decryptedData.Success)
       {
         if(!decryptedData.Accounts.length)
         {
           this.gVars.toastr.error('You are not allowed to view this page','Taking you home...')
           this.gVars.goHome()
           return         
         } 

         this.allAccounts = decryptedData.Accounts
         this.accountGroup = decryptedData.AccountGroup
         this.totalCount  = decryptedData.TotalAccounts  
         this.pager = this.paged.getPager(this.totalCount, this.activePage)         
         let acc = (this.allAccounts.filter(function(e){
          return e.PrimaryAccount;              
        }))
        if(acc.length == 0)
        {
          console.log('ss')
          acc = this.allAccounts[0]
          this.defaultAcc = acc 
        }else{
          this.defaultAcc = acc[0]
        }
        this.computeCurrency(this.defaultAcc.Currency)
        this.selectedNumber =  this.defaultAcc.AccountNumber;
        this.defId =  this.defaultAcc.AccountId;
        this.GetAccountHistory(this.defId)
         return   
       } 
       else{
         this.gVars.toastr.error(decryptedData.ResponseMessage,'Redirecting...')
         this.gVars.goHome()
       }
     },
     err=>{
       this.gVars.spinner.hide()
       this.gVars.toastr.error('Unable to fetch accounts', 'Redirecting...')
       setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
       }, 1000);
     }
   )
  }

  GetAccountHistory(id)
  {
    var mytoday = new Date();
    var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 3);
    var startDate = firstDay.toISOString().slice(0,10);
    var endDate =  mytoday.toISOString().slice(0,10); 
    let body = {
      AccountId: id,
      Session: this.userLoad.session,
      Username: this.userLoad.username,
      StartDate: startDate,
      Enddate: endDate,
      dashboard:false
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body)) 
    this.manage.FetchHistory({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.allHistory = decryptedData.Result;
          this.transHistory = this.allHistory;
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }

  sortHistory(data)
  {
    if(data === 'all')
    {
      this.transHistory = this.allHistory
    }
    else if(data == 'D' || data == 'C'){
        this.transHistory = this.allHistory.filter(function (e) {
        return e.DRCR === data;              
      });
    }else if(data =='DR' || data == 'CR'){
      this.transHistory = this.allHistory.filter(function (e) {
        return e.DRCR === data;              
      });
    }
  }

  filterHistory(data)
  { 
    this.gVars.spinner.show()
    this.FilterForm.get('accountId').setValue(this.defId)
      let payload = {
        ...data,
        startDate: this.gVars.convertDate(data.startDate),
        endDate: this.gVars.convertDate(data.endDate),
        accountId:this.defId
      }
    let newBody = this.gVars.EncryptData(JSON.stringify(payload))
    this.manage.FetchHistory({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.allHistory = decryptedData.Result;
          this.transHistory = this.allHistory;
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }

  downloadStatement()
  {
    if(this.FilterForm.invalid)
    {
      this.gVars.toastr.error('Please select statement period')
      return false;
    }
    this.gVars.spinner.show()
    this.FilterForm.get('accountId').setValue(this.defId)
    this.CheckSize(this.FilterForm.value)
  }

  CheckSize(data)
  {
    let payload = {
            ...data,
            startDate: this.gVars.convertDate(data.startDate),
            endDate: this.gVars.convertDate(data.endDate),
          }
     this.manage.checkSize(payload).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(!res.sizeOk)
        {
        this.gVars.toastr.error(res.remark,'Please try again')
        return 
        }
        else{
          window.open(environment.devUrl.authService+'AccountCenter/TransStatement/'+payload.username+'/'+payload.accountId+'/'+payload.startDate+'/'+payload.endDate, '_blank')
        }
      },err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that','Taking you home...')
        setTimeout(() => {
          this.gVars.router.navigate(['/'])
        }, 1500);
      }
    )
  }
 switchAcc(data)
  {
    this.gVars.spinner.show()
    this.selectedNumber = data.AccountNumber;
    this.defId = data.AccountId;
    this.computeCurrency(data.Currency)
    this.GetAccountHistory(data.AccountId)
  }
  cutString(data)
  {
    if (data.length > 11) {
       return data = data.substring(0, 10) + "...";
    }
  }
 
  computeCurrency(data:string)
  {
    switch(data)
    {
      case 'NGN':
        this.selectedCurrency = '&#8358;'
      break
      case 'EUR':
        this.selectedCurrency = '&#8364;'
      break
      case 'GBP':
        this.selectedCurrency = '&#163;'
      break;
      case 'USD':
        this.selectedCurrency = '&#36;'
      break;
    }
  }

  transformString(data)
  {
    return JSON.stringify(data);
  }
  sliceArray(data)
  {
    return data.slice(0,3)
  }

  MarkPayment(id,data)
  {
    let isChecked = $('#item'+id).val()
    isChecked = JSON.parse(isChecked)
    if ($('#item'+id).is(":checked"))
        {
          if(data.AccountId in this.newArr)
          {
            return false
          }
          this.newArr.push(isChecked)
        }
        else{
          this.newArr =  this.newArr.filter(data => data.AccountId != isChecked.AccountId)
        } 
      return
  }

  SetDefault(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      accountId: data.AccountId
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.manage.SetDefaultAccount({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          window.location.reload()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again!')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }

  downloadXLs()
  {
    this.gVars.spinner.show()
    if(this.FilterForm.invalid)
    {
      this.gVars.toastr.error('Please select statement period')
      return false;
    }
    this.gVars.spinner.show()
    this.FilterForm.get('accountId').setValue(this.defId)
    this.CheckXLSize(this.FilterForm.value)
  }

  CheckXLSize(data)
  {
    let payload = {
      ...data,
      startDate: this.gVars.convertDate(data.startDate),
      endDate: this.gVars.convertDate(data.endDate),
    }
     this.manage.checkSize(payload).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(!res.sizeOk)
        {
        this.gVars.toastr.error(res.remark,'Please try again')
        return 
        }
        else{
          window.open(environment.devUrl.authService+'AccountCenter/TransStatementExcel/'+payload.username+'/'+payload.accountId+'/'+payload.startDate+'/'+payload.endDate, '_blank')
        }
      }
    )
  }

  downloadMT940()
  {
    if(this.FilterForm.invalid)
    {
      this.gVars.toastr.error('Please select statement period')
      return false;
    }
    window.open(environment.devUrl.authService+'AccountCenter/TransStatementMT940/'+this.FilterForm.value.username+'/'+this.FilterForm.value.accountId+'/'+this.FilterForm.value.startDate+'/'+this.FilterForm.value.endDate, '_blank')
  }
  
  getClass(data:string)
  {
    if(data === 'Active')
    {
      return 'text-success'
    }
    else{
      return 'text-danger'
    }
  }


  ///

  nextPage(data)
  {
    // this.SearchForm.get('page').setValue(data)
    // this.SearchCategory(this.SearchForm.value)
  }

  setPage(page:number)
  {
    this.activePage = page
    if(page < 1 || page > this.pager.totalPages)
    {
      return
    }
    this.pager = this.paged.getPager(this.totalCount, page)
    // this.SearchForm.get('page').setValue(page)
    this.GetNextPage(page)
  }

  GetNextPage(page)
  {
    this.gVars.spinner.show()
    const body  = {
      ...this.userLoad,
      page: page-1,
      recordPerPage: 6
    }
    const newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.manage.FetchAccounts({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
       const decryptedData =  JSON.parse(this.gVars.DecryptData(res.encryptedData))
       if(decryptedData.Success)
       {
          this.allAccounts = decryptedData.Accounts
          this.scrollTop()
       }else{
         this.gVars.toastr.error(decryptedData.ResponseMessage)
       }
      }
    )
  }

  scrollTop()
  {
    let scrollToTop = window.setInterval(()=>{
      let pos =  window.pageYOffset;
      if(pos > 0)
      {
        window.scrollTo(0, pos - 20)
      }else{
        window.clearInterval(scrollToTop)
      }
    },16)
  }
 


}
