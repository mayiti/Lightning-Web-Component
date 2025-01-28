import { LightningElement } from 'lwc';
import SignIn from './SignIn.html';
import SignUp from './SignUp.html';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_USERNAME from '@salesforce/schema/Account.UserName__c';
import ACCOUNT_PASSWORD from '@salesforce/schema/Account.Password__c';
import AccountSigninMethod from '@salesforce/apex/AccountLoginform.AccountSigninMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class LogInForm extends NavigationMixin (LightningElement) {
    SignIn = true;
    unamevalue = '';
    passvalue = '';
    namevalue = '';
    repassvalue = '';
    render(){
        return this.SignIn ? SignIn : SignUp;
    }
    handleClick(){
        this.cancleHandler();
        this.SignIn = this.SignIn === true ? false : true;
     }

    handleChange(event){
        let {name, value} = event.target;
        if(name === 'uname'){
            this.unamevalue = value;
        }
        else if(name === 'pass'){
            this.passvalue = value;
            console.log('Password is ', this.passvalue);
        }
        else if(name === 'name'){
            this.namevalue = value;
        }
        else if(name === 'repass'){
            this.repassvalue = value;
            console.log('Re Password is ', this.repassvalue);
        }
    }

    loginHandle(){
        AccountSigninMethod({
            username: this.unamevalue,
            password: this.passvalue
            }).then((result)=>{
                if(result != null){
            console.log('Found Successfully ',result);
            let pageref = {
                type: 'standard__recordPage',
                attributes: {
                    recordId: result,
                    objectApiName: ACCOUNT_OBJECT.objectApiName,
                    actionName: 'view'
                }
            };
            this[NavigationMixin.Navigate](pageref);
            this.showToast();

        }
        else if(result == null || result == '' || result == undefined || result.length < 1){
            console.log('Not Found ',result);
            this.showErrorToast();
        }
    }).catch((error)=>{
               console.log('Error which fetching Account ',error);
               this.showErrorToast();
        });

    }

    createHandler(){
        if(this.validateInput()){
        let inputfield = {};
        inputfield[ACCOUNT_NAME.fieldApiName] = this.namevalue;
        inputfield[ACCOUNT_USERNAME.fieldApiName] = this.unamevalue;
        inputfield[ACCOUNT_PASSWORD.fieldApiName] = this.passvalue;

        let recordInput = {apiName: ACCOUNT_OBJECT.objectApiName, fields: inputfield};
        
        createRecord(recordInput).then((result)=>{
            console.log('Account Created Successfully ',result);
            this.showCretedToast();
            this.handleClick();
        }).catch((error)=>{
            console.log('Error while creating Account ',error);
            this.showErrorCreatedToast();
        })
    }
    else{
        this.showRepassErrorToast();
    }
    }

    cancleHandler(){
        this.unamevalue = ' ';
        this.passvalue = null;
        this.namevalue = '';
        this.repassvalue = null;
    }

    validateInput(){
        if(this.repassvalue == this.passvalue ){
            return true;
        }
        else if(this.repassvalue != this.passvalue){
            return false;
        }
    }

    showToast(){
        const event = new ShowToastEvent({
            title: 'Log In Successfully',
            message: 'You are authroized',
            variant: 'success',
        });
        this.dispatchEvent(event);
}
    showErrorToast(){
        const event = new ShowToastEvent({
            title: 'Log In Unsucessfully',
            message: 'Please check your credentials',
            variant: 'error',
        });
        this.dispatchEvent(event);
}
    showCretedToast(){
        const event = new ShowToastEvent({
            title: 'Account Created Successfully',
            message: 'You can login now',
            variant: 'Success',
    });
    this.dispatchEvent(event);
}
    showErrorCreatedToast(){
        const event = new ShowToastEvent({
            title: 'Account Created Unsucessfully',
            message: 'Please try after some time',
            variant: 'error',
    });
    this.dispatchEvent(event);
    }
    showRepassErrorToast(){
        const event = new ShowToastEvent({
            title: 'Re Password Mismatch',
            message: 'Please check your Re Password',
            variant: 'error',
    });
    this.dispatchEvent(event);
    }
}