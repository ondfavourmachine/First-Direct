import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from '../globals/globals.service';


import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  subsidiaries: any;
  fullName: any;
  userRoles: any;
  allowedRoutes: any;
  intervalId: any;
  executed: boolean;
  CommentForm: FormGroup;
  notifications: any;

  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;
  location:string;
  userLoad:{username:string, subsidiaryId:number,session:string};
  activeSub:any;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    public gVars: GlobalsService,
    private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef,
  ) { 
    this.location= window.location.pathname
    idle.setIdle(1200); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(1200); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active
    if(this.location.includes('auth'))
    {
      return
    }
    else{
        this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
        this.activeSub = JSON.parse(this.gVars.DecryptData(sessionStorage.getItem('scribbl')))
        idle.onIdleStart.subscribe(() => {
        this.idleState = "IDLE";
      });
    }
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge
    });
     // do something when the user has timed out
     idle.onTimeout.subscribe(() => this.Logout());
     // do something as the timeout countdown does its thing
     idle.onTimeoutWarning.subscribe(seconds => this.showWarning());
     // set keepalive parameters, omit if not using keepalive
     keepalive.interval(15); // will ping at this interval while not idle, in seconds
     keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings
  }
  showWarning()
  {
    $('#overTimeModal').modal('show')
  }
  ngOnInit(): void {
    this.reset();
    this.CommentForm = this.fb.group({
      rating:['', Validators.required],
      comment:['']
    })
    this.ListSubsidiaries()
    this.userRoles = this.activeSub.SubsidiaryName
   // this.setInterval()
  }
  ngOnDestroy()
  {
    clearInterval(this.intervalId)
  }
  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ConfirmLogout()
  {
    $('#logoutMoodal').modal('show')
  }
  notIdle()
  {
    this.reset()
  }
 async Logout()
  {
    $('#overTimeModal').modal('hide')
       await this.auth.userLogout(this.userLoad.username,this.userLoad.session).subscribe(
        res=>{
            this.gVars.toastr.info('Logging you out..')
            setTimeout(() => {      
            this.gVars.spinner.hide()
              $('.modal').modal('hide');
              clearInterval(this.intervalId)
            }, 900);  
          sessionStorage.clear()
          this.gVars.router.navigate(['/login'])            
        },
        err=>{
         
          this.gVars.spinner.hide()
          this.gVars.router.navigate(['/login'])
          this.gVars.toastr.error('Unable to perform that task','Redirecting you...')
        }
      ) 
  }
  ListSubsidiaries()
  {
   this.subsidiaries = JSON.parse(this.gVars.DecryptData(sessionStorage.getItem('plomk'))).GetSubsidiaries
   this.fullName =  JSON.parse(this.gVars.DecryptData(sessionStorage.getItem('plomk'))).Fullname
  }

  switchSub(data)
  {
    this.gVars.spinner.show()
    let body = {
      session:this.userLoad.session,
      username: this.userLoad.username,
      subsidiaryId: data,
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.GetSubsidiary({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData)
        {
          sessionStorage.setItem('scribbl', this.gVars.EncryptData(JSON.stringify(decryptedData)))
          setTimeout(() => {  
            this.gVars.toastr.success('Fetching new information...','Switch Successful')
              window.location.reload()
          }, 1000);        
        }
        else{
          this.gVars.toastr.error('Something went wrong')
          this.gVars.router.navigate(['/auth/login'])
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to switch subsidiaries','Redirecting...')
        this.gVars.router.navigate(['/auth/login'])
      }
    )
  }

  getActive(data)
  { 
    let activeID = sessionStorage.getItem('scribbl')
    if(activeID)
    {
      if(data.SubsidiaryId === this.activeSub.SubsidiaryId)
      {
        return true;
      }
    }
    
  }

  setInterval()
  {
   this.intervalId =  setInterval(() =>{
      this.GetNewNotifications()
    },1200000)
  }
  
  GetNewNotifications()
  {
    let body = {
      session:this.userLoad.session,
      username:this.userLoad.username,
      subsidiaryId:this.activeSub.subsidiaryId
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.GetNewNotifications({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Success)
          {
              let notifications = decryptedData.Notifications
              if(notifications.length)
              {
                notifications.forEach(element => {
                  this.gVars.toastr.info(element.Message, element.SubsidiaryName)
                });
              } 
          }else{
            return;
            this.gVars.toastr.error(decryptedData.ResponseMessage)           
            setTimeout(() => {
               this.gVars.router.navigate(['/login'])
            }, 1500);
          }         
      }
    )
  }

  SubmitLogout(item)
  {
    let body = {
      ...this.userLoad,
      rating: item.rating,
      comment: item.comment
    }
    // let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.AddFeedback({body}).subscribe(
      res=>{
        //let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.toastr.success(res.responseMessage,'You are now being logged out...')
        $('#logoutMoodal').modal('hide')
        setTimeout(() => {
          this.Logout()
        }, 1000);
      },
      err=>{
        this.gVars.toastr.success('Unable to complete','You are now being logged out...')
        $('#logoutMoodal').modal('hide')
        setTimeout(() => {
          this.Logout()
        }, 1000);
      }
    )
  }

  SelectRating(data)
  {
    this.CommentForm.get('rating').setValue(data)
  }
  Skip()
  {
    $('#logoutMoodal').modal('hide')
    this.Logout()
  }

  GetNotifications()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.GetNotifications({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.notifications = decryptedData.Notifications.slice(0,10)
          $('#mySidepanel').width(250)
        }
        else{
          this.gVars.toastr.error(res.ResponseMessage)           
          setTimeout(() => {
             this.gVars.router.navigate(['/login'])
          }, 1500);
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

  closeNav()
  {
    $('#mySidepanel').width(0)
  }

  handleLogout(data)
  {
    console.log('received:', data)
  }

  
}
