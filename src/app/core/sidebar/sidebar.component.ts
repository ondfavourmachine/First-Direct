import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalsService } from '../globals/globals.service';
import { AuthService } from '../services/auth.service';
import { CollectionsService } from '../services/collections.service';

declare var $:any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  allowedRoutes: any = '';
  notifications: any;
  Categories: any = [];
  customCategories: any = [];
  userLoad:{username:string, subsidiaryId:number,session:string};
  activeSub:any;
  constructor(
    private auth:AuthService,
    public gVars:GlobalsService,
    private collectionService: CollectionsService,
    private activated: ActivatedRoute
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
    this.activeSub = JSON.parse(this.gVars.DecryptData(sessionStorage.getItem('scribbl')))
  }

  ngOnInit(): void {
    this.allowedRoutes = this.activeSub.GetModules;
    if(!this.allowedRoutes)
    {
     this.gVars.takeOut()
    }
    //this.GetSchemeCategories();
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
          this.notifications = decryptedData.Notifications
          $('#mySidepanel').width(250)
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)           
          setTimeout(() => {
             this.gVars.router.navigate(['/login'])
          }, 1500);
        }        
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/login']);
        }, 1500);
      }
    )
  }

  closeNav()
  {
    $('#mySidepanel').width(0)
  }

  redirectTo(uri:string){
    this.gVars.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.gVars.router.navigate([uri]));
 }

 GetSchemeCategories() {
  {
    let body = {
      ...this.userLoad
    };
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    // this.spinner.show();
    this.collectionService.FetchCategories({encryptedData:newBody}).subscribe(
      (res) => {
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if (decryptedData.Success) {
          //assign
          this.Categories = decryptedData.Categories;
        }
      },
      (err) => {
        // this.spinner.hide();
        // this.toastr.error("Unable to complete that request");
      }
    );
  }
}

CheckActiveSub(data:String)
{
  return data === this.activated.snapshot.routeConfig.path ? 'link-active' :  ''
}
checkActiveMain(data)
{
  return((this.gVars.router.url.split("/")).includes(data) ? 'active' : '')
}

}