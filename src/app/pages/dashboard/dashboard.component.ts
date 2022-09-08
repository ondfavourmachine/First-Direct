import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';


declare var $:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  accounts: any;
  single:any[];
  defaultAcc: any;
  Summary: any;
  transHistory: any;
  weekly:boolean = true;
  multi:any;
  view: any[] = [700, 500];
  loading:boolean = false
  rateLoading:boolean = false
  trendLoading:boolean = false
  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Period';
  yAxisLabel: string = 'Amount';
  timeline: boolean = true;
  isFirstTime:boolean = false;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  }; 

  exchangeRate: any;
  selectedNumber: any;
  defId: any;
  spendPattern: any;
  HistoryList: any;
  userLoad:{username:string, subsidiaryId:number,session:string};
  selectedCurrency: string;
  constructor(
    private dash: DashboardService,
    public gVars: GlobalsService
  ) {
    // this.userLoad = {
    //   session:(JSON.parse(sessionStorage.getItem('userData'))).Session,
    //   username: sessionStorage.getItem('username'),
    //   subsidiaryId:(JSON.parse(sessionStorage.getItem('activeSub'))).SubsidiaryId
    // }
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    setTimeout(() => {
      this.GetAccounts()
    }, 900);
     $('[data-toggle="tooltip"]').tooltip()
 }

  ngAfterViewInit()
  {
  
  }

  GetAccounts()
  {
    this.gVars.spinner.show()
    let body ={
     ...this.userLoad,
     page:0,
     recordPerPage:3
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
   this.dash.FetchAccounts({encryptedData:newBody}).subscribe(
     res=>{
        this.gVars.spinner.hide()
       const decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
       if(decryptedData.Success)
       {       
          this.loading = true
          if(decryptedData.Accounts.length > 0 )
          {
              this.accounts  = decryptedData.Accounts
              let acc = this.accounts.filter(account => account.PrimaryAccount)
              if(!acc.length)
              {
                acc = this.accounts[0]
                this.defaultAcc = acc 
              }else{
                this.defaultAcc = acc[0]
              }  
              this.computeCurrency(this.defaultAcc.Currency)
              this.selectedNumber =  this.defaultAcc.AccountNumber;
              this.defId =  this.defaultAcc.AccountId;
              this.GetSpendPattern(body, this.defId)
              this.GetTransactionHistory(body, this.defId) 
              if(!this.isFirstTime)
              {
                  setTimeout(() => {
                    if(decryptedData.MaskAccountBalance)
                    {
                      for(var i in decryptedData.Accounts)
                      {
                        this.toggleView(i, decryptedData?.Accounts[i])
                      }
                    }
                    this.gVars.spinner.hide()
                  }, 2500);
                  this.isFirstTime = true
                let stuff = this.gVars.EncryptData(true.toString())
                sessionStorage.setItem('isMasked',stuff)             
              }else{
                this.gVars.spinner.hide()
              }
          }    
        }
        else{
          this.gVars.takeOut('Invalid Session')         
        } 
     },
     err=>{
       this.gVars.spinner.hide()
       this.gVars.toastr.error('Unable to fetch accounts', 'Redirecting...')
       this.gVars.takeOut()   
     }
   ) 
  this.GetRates(newBody)
   this.GetSummary(newBody)
  }
  GetRates(data)
  {
    this.dash.FetchRates({encryptedData:data}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.rateLoading = true
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
          this.exchangeRate = decryptedData.ExchangeRate
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again later')
        }
      },
      err=>
      {
        //this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to retrieve exchange rates', 'Please try later')
      }
    )
  }

  GetSummary(data)
  {
    this.dash.FetchSummary({encryptedData:data}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.Summary = decryptedData;
        }
        else{
        //  this.GetSummary(data)
          //this.gVars.toastr.error('Unable to Retrieve Work Summary')
        }
      },
      err=>{
        this.gVars.toastr.error('Workspace summary unavailable right now','Please Check later!')
      }
    )
  }
  GetTransactionHistory(data, id)
  { 
    var mytoday = new Date();
    var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    var startDate = firstDay.toISOString().slice(0,10);
    var endDate =  mytoday.toISOString().slice(0,10); 
    let body = {
      AccountId: id,
      Session:  this.userLoad.session,
      Username: this.userLoad.username,
      StartDate: startDate,
      Enddate:endDate,
      dashboard:true
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.dash.FetchHistory({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.transHistory = decryptedData;
          this.HistoryList = decryptedData.Result
        }
        else{
         // this.gVars.takeOut()   
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again')
        }       
      }
      ,err=>{
        this.gVars.toastr.error('Unable to Fetch history')
      }
    )
  }

  GetSpendPattern(data,defaultAccount)
  {
    let body = {
      Week: this.weekly,
      ...this.userLoad,
      AccountId:defaultAccount
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.dash.FetchPattern({encryptedData:newBody}).subscribe(
      res=>{
        this.trendLoading = true;
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          //this.gVars.spinner.hide() 
          let dataSet = decryptedData.Result.SpendPattern.map(datum => ({ name:datum.Date, value: datum.Amount }));
          this.spendPattern = dataSet
          this.single= [
            {
              "name": "Amount",
              "series": dataSet
            }
          ]
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Unable to get spend pattern')
        }
      }
    )
  }

  switchAcc(data)
  {
    //this.gVars.spinner.show()
    this.selectedNumber = data.AccountNumber;
    this.computeCurrency(data.Currency);
    this.GetTransactionHistory({
      username:this.userLoad.username,
      session:this.userLoad.session}
      ,data.AccountId)
      this.GetSpendPattern(
        {session:this.userLoad.session,
        subsidiaryId:this.userLoad.subsidiaryId,
        username:this.userLoad.username}
      , data.AccountId)
  }
  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  cutString(data)
  {
    if (data.length > 11) {
       return data = data.substring(0, 10) + "...";
    }
  }

  calculateStyles(data)
  {
    this.gVars.spinner.show()
    if(data === 'monthly')
    {
      this.weekly = false
    }else{
      this.weekly = true
    }
    this.GetSpendPattern(
      {...this.userLoad}
    , this.defId)
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
  
  toggleView(number,account)
  {  
    const aBalance = $("#availBalance"+number);
    const aToReplace = aBalance.text();
    const lBalance  = $("#ledBalance"+number);
    const lToReplace = lBalance.text();
    if(aToReplace.includes('*') && lToReplace.includes('*'))
    {
      aBalance.text(account?.AvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }))
      lBalance.text(account?.LedgerBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }))
      $('#eye'+number).removeClass('fa-eye-slash')
    }else{
      let xAvailableBal = account?.AvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })
      let xLedgerBal = account?.LedgerBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })
      const newABal = aToReplace.replace(xAvailableBal, '******');
      aBalance.text(newABal); 
      const newLBal = lToReplace.replace(xLedgerBal, '******');
      lBalance.text(newLBal); 
      $('#eye'+number).addClass('fa-eye-slash')
    }
  }
  
  repeatStringNumTimes(string, times)
  {
   var repeatedString = "";
    while (times > 0) {
      repeatedString += string;
      times--;
    }
    return repeatedString;
  } 

}
