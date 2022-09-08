import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


declare var $:any;

export interface lookupView {
  name: string,
  data: string,
  value: string,
  desc: string
}

@Injectable({
  providedIn: 'root'
})
export class GlobalsService implements OnChanges{
  ipAddress: string ='10.1.1.1'
  key = CryptoJS.enc.Utf8.parse(environment.spmo.mlm);
  iv = CryptoJS.enc.Utf8.parse(environment.spmo.nlp);
  schemeFee: any = {};
  scheme: any = {};
  formFields: any = {};
  formKeys: Array<any> = [];
  isLookupDone: boolean = false;
  isSetAmount: boolean = false;
  tenantCode: any = '';
  paymentType: any = '';
  amount: any = '';
  dropdownArray: Array<lookupView> = [];
  dropdownSetup: any = {};
  instID:  any;
  billerName: any;
  stuff:any;
  routeName:string;
  userLoad:any;
  constructor(
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public router:  Router,
    public activated: ActivatedRoute
  ) { 
    
  }
  ngOnChanges(changes: SimpleChanges): void {
  }


  checkRoute(data)
  {
    if(data.includes('auth'))
    {
        console.log('auth page')
    }else{
      return this.fetchData()
    }
  }
  fetchData()
  {
      const userLoad = JSON.parse(this.DecryptData(sessionStorage.getItem('plomk')))
    return this.userLoad = {
        username:this.DecryptData(sessionStorage.getItem('mfdn')),
        subsidiaryId:JSON.parse(this.DecryptData(sessionStorage.getItem('scribbl'))).SubsidiaryId,
        session:userLoad.Session
     }
  }
  StyleAmount(data:string)
  {
    switch(data)
    {
      case 'CR':
        return 'text-success'
      break;
      case 'C':
        return 'text-success'
      break;
      case 'DR':
        return 'text-danger'
      break;
      case 'D':
        return 'text-danger'
      break;
    }
  }
  StringifyString(data)
  {
    return JSON.stringify(data)
  }

  CheckValue(event)
  {
    const pat = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/
    if(!pat.test(event.target.value))
    {
      return event.target.value = '';
    }
    return
  }

  minDate()
    {
      var dtToday = new Date();
      var month:any = dtToday.getMonth() + 1;
      var day:any = dtToday.getDate();
      var year:any = dtToday.getFullYear();
      if(month < 10)
          month = '0' + month.toString();
      if(day < 10)
          day = '0' + day.toString();
      var maxDate = year + '-' + month + '-' + day; 
      $('#startDate').attr('min', maxDate);
      $('#endDate').attr('min', maxDate);
    }
    disableDate(){
      return false;
    } 

  DecryptData(data) {
    try {
      let plaintext = CryptoJS.AES.decrypt(data, this.key, {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      return CryptoJS.enc.Utf8.stringify(plaintext);
    }
    catch (err) {
      return err;
    }
  }
  EncryptData(decryptedData) {
    let the_encrypted = CryptoJS.AES.encrypt(decryptedData, this.key,
      {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return the_encrypted.toString();
  }
  GetCurrentDates()
  {
   let  mytoday = new Date();
    let firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 3);
    let startDate = firstDay.toISOString().slice(0,10);
    let endDate =  mytoday.toISOString().slice(0,10); 
    let currentDates = {
      startDate,
      endDate
    }
    return currentDates
  }

  getData(field, data) {
    if(data == undefined) return;
    let lookup = field.LookupItems;
    let singleData: any = {};
    lookup.forEach(element => {
      if(element.ItemDataValue == data) {
        singleData = element;
      }
    });
    if(field.FieldName) {
      this.dropdownSetup[field.FieldName] = singleData;
    }
    if(field.PopulateAmount){
      this.amount = singleData.Amount;
      this.isSetAmount = true;
    }
  }

  goHome(message?:string)
  {
    message ? this.toastr.error(message,'Taking you home...'): '';
    this.spinner.hide()
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
     }, 1500);
  }
 
  reloadAfter()
  {
    this.spinner.hide()
    setTimeout(() => {
      window.location.reload()
    }, 1500);
  }
  takeOut(message?:string)
  {
    this.toastr.error(message,'Unable to complete that request')
    this.spinner.hide()
    setTimeout(() => {
      this.router.navigate(['/login']);
     }, 1500);
  }
  checkData(data)
  {
    console.log(data.length)
    if(!data.length){
      this.toastr.error('No data available for export!')
      return true
    }
  }
  convertDate(data)
  {
    var dtToday = new Date(data);
    var month:any = dtToday.getMonth() + 1;
    var day:any = dtToday.getDate();
    var year:any = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    var formattedDate = year + '-' + month + '-' + day; 
    return formattedDate
  }

  getRef(len, bits) {
    bits = bits || 2;
    var outStr = "FCYTRF", newStr;
    while (outStr.length < len)
    {
        newStr = Math.round(Date.now() + Math.random()).toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
    }

    GenerateRef(len,bits)
    {
      let str = new Date();
      bits = bits || 36;
      var outStr = "", newStr;
      while (outStr.length < len)
      {
          newStr = Math.round(Date.now() + Math.random()).toString(bits).slice(2);
          outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
      }
      return 'BLK'+outStr.toUpperCase()+str.getHours()+''+str.getMinutes()+''+str.getSeconds();
    }

    fileToBase64 = (filename, filepath) => {
      return new Promise(resolve => {
        var file = new File([filename], filepath);
        var reader = new FileReader();
        // Read file content on file loaded event
        reader.onload = function(event) {
          resolve(event.target.result);
        };
        // Convert data to base64 
        reader.readAsDataURL(file);
      });
    }
}
