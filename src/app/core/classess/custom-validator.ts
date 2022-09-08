import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms'

export class CustomValidators{

    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn{
        return (control: AbstractControl):{ [key: string]: any} =>{
            if(!control.value){
                //empty control, return zero error
                return null;
            }

            //test the value of the control vs the regexp given
            const valid = regex.test(control.value);

            //if true, return no error, else retun error passed in the second parameter
            return valid ? null: error;
        };
    }

    static passwordMatchValidator(control: AbstractControl){
        const newPassword: string = control.get('newPassword').value;//get new password
        const confirmPassword: string = control.get('confirmPassword').value;//get confirmed password
        //compare match
        if(newPassword !== confirmPassword)
        {   
            control.get('confirmPassword').setErrors({ NoPasswordMatch: true});
        }
    }

    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null { 
        // console.log(control.value);
        if(control.value == null) {
            return;
        } 
        if((control.value as string).indexOf(' ') >= 0){  
            return {cannotContainSpace: true}  
        }  
    
        return null;  
    }  

    static mustNotMatchAmount(control: AbstractControl) { 
        const amount: string = control.get('amount').value;
        const minimumAmount: string = control.get('minimumAmount').value;

        if(minimumAmount > amount){  
            control.get('minimumAmount').setErrors({ NoAmount: true});  
        }  
    }  
}