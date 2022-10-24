import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { AuthService } from 'src/app/core/services/auth.service';

declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  tokenReq:boolean =  false;
  userData: string;
  ipAddress: string ='10.1.1.1'
  session: string;
  constructor(
    private fb: FormBuilder,
    public gVars: GlobalsService,
    private auth: AuthService,
  ) { 
    this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit() {
    this.LoginForm = this.fb.group({
      OrgCode: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      token: ['']
    })
  }
  
  Login(data)
  {
  this.gVars.spinner.show();
   let body = {
    CorporateCode: data.OrgCode,
    Username: data.username,
    Password: data.password,
    IpAddress: this.ipAddress,
    MacAddress: '2C:54:91:88:C9:E3'
   }
   let newBody = this.gVars.EncryptData(JSON.stringify(body));
   this.auth.login({encryptedData:newBody}).subscribe(
     res =>{
       this.gVars.spinner.hide()
       let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
       if(decryptedData.Success && decryptedData.ChangePassword)
       {
         this.gVars.toastr.info(decryptedData.ResponseMessage)
         sessionStorage.setItem('resetSession',decryptedData.Session)
         sessionStorage.setItem('mfdn',this.gVars.EncryptData(body.Username+'@'+body.CorporateCode))
         setTimeout(() => {
           this.gVars.router.navigate(['/auth/reset-password','existing'])
         }, 1500);         
       }
       else if(!decryptedData.Success && decryptedData.Response == 19)
       {
        sessionStorage.setItem('mfdn',this.gVars.EncryptData(body.Username+'@'+body.CorporateCode))
        $('#loggedIn').modal('show')
       }
      else if(decryptedData.Success && !decryptedData.ChangePassword)
       {
        sessionStorage.setItem('mfdn',this.gVars.EncryptData(body.Username+'@'+body.CorporateCode))
        this.handleLogin(decryptedData)
       }
       else if(!decryptedData.Success && !decryptedData.ChangePassword)
       {
         this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try later')
       }  
       else{
        this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try later')
       }    
     },
     err=>{
       this.gVars.spinner.hide()
       this.gVars.toastr.error('Unable to complete that','Please try later')
       this.LoginForm.reset()
     }
   )
  }

  handleLogin(data)
  {
    this.userData = JSON.stringify(data)
    
   if(data.TokenRequired)
   {
     this.session = data.Session
     this.gVars.toastr.info('Enter Token to Proceed')
     this.gVars.spinner.hide()
     this.tokenReq = true;   
    $('#org').attr('disabled', 'disabled')
    $('#username').attr('disabled', 'disabled')
    $('#pass').attr('disabled', 'disabled')
   }
   else{
     sessionStorage.setItem('plomk', this.gVars.EncryptData(this.userData))
     sessionStorage.setItem('scribbl',this.gVars.EncryptData(JSON.stringify(data.GetSubsidiaries[0])))
     sessionStorage.setItem('lorem', this.gVars.EncryptData(data.Token))
     this.gVars.toastr.success('Login Successful','Redirecting...')
     if(data.Advert)
     {
       this.gVars.router.navigate(['/ads'])
     }else{
       setTimeout(() => {
       // this.gVars.toastr.info('Dear '+ JSON.parse(sessionStorage.getItem('userData')).Fullname+ ', welcome to FirstDirect 2.0','Last Login Date '+JSON.parse(sessionStorage.getItem('userData')).LastLogin) 
        this.gVars.router.navigate(['/dashboard'])
          },1500); 
     }        
   }
  }
  ValidateToken()
  {
    this.gVars.spinner.show()
    let body = {
      Username:`${this.LoginForm.value.username}@${this.LoginForm.value.OrgCode}`,
      Session:this.session,
      Token: this.LoginForm.get('token').value,
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.verifyToken({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        { 
          sessionStorage.setItem('plomk', this.gVars.EncryptData(this.userData))
          sessionStorage.setItem('scribbl',this.gVars.EncryptData(JSON.stringify(decryptedData.GetSubsidiaries[0])))
          sessionStorage.setItem('lorem', this.gVars.EncryptData(decryptedData.Token))
          this.gVars.toastr.success('Token Validated Succesfully', 'Redirecting you...')
          setTimeout(() => {
            this.gVars.router.navigate(['/dashboard'])
           // this.gVars.toastr.info('Dear '+ JSON.parse(sessionStorage.getItem('userData')).Fullname+ ', welcome to FirstDirect 2.0','Last Login Date '+JSON.parse(sessionStorage.getItem('userData')).lastLogin)
          }, 1500);         
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again')
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to Login', 'Please try later')
      }
    )
   
  }

  RetrieveIp()
  {
    this.auth.GetIp().subscribe(
      res=>{
        this.ipAddress = res.ip
      }
    )
  }
  Reveal(data)
  {
    let word = $('#'+data).attr("type")
    if(word == "password")
    {
      $("#"+data).attr("type","text");
    }
    else{
      $("#"+data).attr("type","password");
    }
  }

  doStrings()
  {
    let str = new Date()
    let num=  Math.floor(100000000 + Math.random() * 900000000);
    return 'FD20'+num+''+str.getFullYear()+''+str.getHours()+''+str.getMinutes()+''+str.getSeconds();
  }
  confirmLogout()
  {
    const decryptedUsername = this.gVars.DecryptData(sessionStorage.getItem('mfdn'))
    this.auth.userLogout(decryptedUsername,this.doStrings()).subscribe(
      res=>{
        this.gVars.toastr.info('Please login again')
        setTimeout(() => {
          location.reload()
        }, 1500);
      },
      err=>{
        setTimeout(() => {
          location.reload()
        }, 1500);
      }
    )
  }
}