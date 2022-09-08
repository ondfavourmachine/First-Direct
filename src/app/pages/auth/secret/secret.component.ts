import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

declare var $:any;
@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.css']
})
export class SecretComponent implements OnInit {

  QuestionForm:FormGroup
  questions: any;
  previousUrl: string;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router:  Router,
    public spinner: NgxSpinnerService
  ) { 
  
  }

  ngOnInit(): void {
    this.FetchQuestions()
    this.QuestionForm = this.fb.group({
        q1: ['',Validators.required],
        a1: ['', Validators.required],
        q2: ['', Validators.required],
        a2: ['', Validators.required],
        q3: ['', Validators.required],
        a3: ['', Validators.required]
    })
  }

  FetchQuestions()
  {
    let body  = {
      session:(JSON.parse(sessionStorage.getItem('userData'))).session,
      username: sessionStorage.getItem('username'),
      subsidiaryId:(JSON.parse(sessionStorage.getItem('activeSub'))).subsidiaryId
    }
    this.auth.GetSecretQuestions(body).subscribe(
      res=>{
        if(res.length)
        {
          this.questions = res
        }
        else{
          this.toastr.error('Unable to fetch questions','Please check later')
          setTimeout(() => {
          //  window.location.reload()
          }, 1500);
        }        
      }
    )
  }
  SetQuestions(data)
  {
    this.spinner.show()
    let body = {
      session:(JSON.parse(sessionStorage.getItem('userData'))).session,
      username: sessionStorage.getItem('username'),
      subsidiaryId:(JSON.parse(sessionStorage.getItem('activeSub'))).subsidiaryId,
      response:[
        {
          id:data.q1,
          value:data.a1
        },
        {
          id:data.q2,
          value:data.a2
        },
        {
          id:data.q3,
          value:data.a3
        }
      ]
    }
    this.auth.SubmitQuestions(body).subscribe(
      res=>{
        this.spinner.hide()
        if(res.success)
        {
          this.toastr.success(res.responseMessage, 'Redirecting..')
          if((JSON.parse(sessionStorage.getItem('userData'))).advert)
          {
            setTimeout(() => {
                  this.router.navigate(['/auth/ads'])
                }, 15000);
          }else{
            setTimeout(() => {
              this.router.navigate(['/dashboard'])
            }, 15000);
          }         
        
        }else{
          this.toastr.error(res.responseMessage)
        }
      },
      err=>{
        this.toastr.error('Unable to complete', 'Redirecting...')
        setTimeout(() => {
          this.router.navigate(['/auth/login'])
        }, 1500);
      }
    )
  }

  toggleDrop(data:string)
  {
    $('#'+data).toggle()
  }
  selectQuestion(selector,answer,item)
  {
    $('#'+answer).text(item.value)
    this.QuestionForm.get(selector).setValue(item.id)
    this.toggleDrop(selector)
    this.questions = this.questions.filter((e)=>{
      return e.id !== item.id
    })
  }

  Reset()
  {
    this.QuestionForm.reset()
    $('#a3').text('Select question 3')
    $('#a2').text('Select question 2')
    $('#a1').text('Select question 1')
    //reset selected questions
  }


}

