import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { AuthService } from 'src/app/core/services/auth.service';

declare var $:any;

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {
  adObj: any;
  adjImg: string;
  userLoad:userData;
  constructor(
    private auth: AuthService,
    private gVars: GlobalsService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {

    this.getAd()
  }

  getAd()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad  
    }
    let newBody:string = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.GetAds({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.adObj = decryptedData
          this.adjImg= `data:image/png;base64, ${decryptedData?.AdvertImg}`
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Redirecting...')
          setTimeout(() => {
            this.gVars.router.navigate(['/'])
            this.gVars.toastr.info('Dear '+ JSON.parse(sessionStorage.getItem('userData')).Fullname+ ', welcome to FirstDirect 2.0','Last Login Date '+JSON.parse(sessionStorage.getItem('userData')).LastLogin) 
          }, 1000);
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.router.navigate(['/login'])
        this.gVars.toastr.error('Unable to perform that task','Redirecting you...')
      }
    )
  }


  Agree(data)
  {
    this.gVars.spinner.show()
    let body = {
     ...this.userLoad,
      advertId: data,
      accept:true
    }
    let newBody:string = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.SubmitAd({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.router.navigate(['/dashboard'])
          this.gVars.toastr.info('Dear '+ JSON.parse(sessionStorage.getItem('userData')).Fullname+ ', welcome to FirstDirect 2.0','Last Login Date '+JSON.parse(sessionStorage.getItem('userData')).LastLogin) 
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Please try again')
        }
      },err=>{
        this.gVars.spinner.hide()
        this.gVars.router.navigate(['/login'])
        this.gVars.toastr.error('Unable to perform that task','Redirecting you...')
      }
    )
  }
  DisAgree()
  {
    $('#disagreeModal').modal('show')
  }

  proceedLogout(data)
  {
    this.gVars.spinner.show()
    this.SayNo(data)
    this.auth.userLogout(sessionStorage.getItem('username'),(JSON.parse(sessionStorage.getItem('userData')).Session)).subscribe(
      res=>{
        this.gVars.toastr.info('Logging you out..')
        setTimeout(() => {
          this.gVars.router.navigate(['/login'])
          this.gVars.spinner.hide()
          sessionStorage.clear()
        }, 1500);
        $('#disagreeModal').modal('hide')      
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.router.navigate(['/login'])
        this.gVars.toastr.error('Unable to perform that task','Redirecting you...')
      }
    )
  }

  SayNo(data)
  {
    let body = {
      ...this.userLoad,
      advertId: data,
      accept:false
    }
    const newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.SubmitAd({encryptedData:newBody}).subscribe(
      res=>{
        // console.log(this.gVars.DecryptData(res))
      }
    )
  }

  
}
