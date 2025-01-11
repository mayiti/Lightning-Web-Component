import { LightningElement,wire,api } from 'lwc';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_Id from '@salesforce/schema/Account.Id';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_WEBSITE from '@salesforce/schema/Account.Website';
import ACCOUNT_RATING from '@salesforce/schema/Account.Rating';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { createRecord, getFieldValue, getRecord, updateRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import createAccount from '@salesforce/apex/AccountHelper.createAccount';
const fieldtoLoad = [ACCOUNT_NAME,ACCOUNT_WEBSITE,ACCOUNT_RATING];
export default class AccountForm extends NavigationMixin (LightningElement){
    accnameval ='';
    accwebsiteval ='';
    accratingval = '';
    @api recordId;

    @wire(getRecord, {recordId: "$recordId",fields: fieldtoLoad
    })wiredgetRecord_Function({data,error}){
        //console.log('accountWired ',wiredgetRecord_Function);
            if(data){
                console.log('Record Data ',data);
                this.accnameval = getFieldValue(data,ACCOUNT_NAME);
                this.accwebsiteval = getFieldValue(data,ACCOUNT_WEBSITE);
                this.accratingval = getFieldValue(data,ACCOUNT_RATING);
            } else if(error){
                console.log('Error in retrieving the Record Info ',error);
            }
        }

    @wire(getObjectInfo, {
        objectApiName : ACCOUNT_OBJECT
    })
     accountobjectInfo;

    @wire(getPicklistValues,{
        recordTypeId: "$accountobjectInfo.data.defaultRecordTypeId", fieldApiName: ACCOUNT_RATING
    })
     ratingpicklist;

    changeHandler(event){
        let {name,value} = event.target;
        if(name === 'accname'){
            this.accnameval = value;
        }
        else if(name === 'accwebsite'){
            this.accwebsiteval= value;
        }
        else if(name === 'accrating'){
            this.accratingval = value;
            
        }
    }

    createAccount(){
            let inputfields = {};
            inputfields[ACCOUNT_NAME.fieldApiName] = this.accnameval;
            inputfields[ACCOUNT_WEBSITE.fieldApiName] = this.accwebsiteval;
            inputfields[ACCOUNT_RATING.fieldApiName] = this.accratingval;

            if(this.recordId){
                console.log('Record Id ',this.recordId);
                inputfields[ACCOUNT_Id.fieldApiName] = this.recordId;
                let recordInput = {
                    fields: inputfields
                };
                updateRecord(recordInput).then((result)=>{
                    console.log('Record Update Successfully ', result);
                    this.ShowToastEvent();
                }).catch((error)=>{
                    console.log('Error while updating record ',error);
                });
            }
            else{
                // Create Account from Iperative Apex Methods
                /*createAccount({
                    accnameval: this.accnameval,
                    accwebsiteval: this.accwebsiteval,
                    accratingval: this.accratingval
                }).then((result)=>{
                    console.log('Account Created Successfully', result);

                    let pageref = {
                        type: 'standard__recordPage',
                        attributes: {
                            recordId: result,
                            objectApiName: ACCOUNT_OBJECT.objectApiName,
                            actionName: 'view'
                        }
                    };
                    this[NavigationMixin.Navigate](pageref);

                    const event = new ShowToastEvent({
                        title: '',
                        message: 'Account Created Successfully',
                        variant: 'success',
                    });
                    this.dispatchEvent(event);
                }).catch((error)=>{
                    console.log('Error while creating Account ',error);
                    const event = new ShowToastEvent({
                        title: '',
                        message: 'Error while Creating Account Record',
                        variant: 'error',
                    });
                this.dispatchEvent(event);
                });
            }*/
           
                //Create Account using Lightning UI Methods
            let recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields: inputfields };

            createRecord(recordInput).then((result)=>{
                console.log('Account Created Successfully',result);
                let pageref = {
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result.id,
                        objectApiName: ACCOUNT_OBJECT.objectApiName,
                        actionName: 'view'
                    }
                };
                this[NavigationMixin.Navigate](pageref);

                const event = new ShowToastEvent({
                    title: '',
                    message: 'Account Created Successfully',
                    variant: 'success',
                }); 
                this.dispatchEvent(event);

            }).catch((error)=>{
                console.log('Error while creating Account',error);
                const event = new ShowToastEvent({
                    title: '',
                    message: 'Error while Creating Account Record',
                    variant: 'error',
                });
            this.dispatchEvent(event);
            });
        }
        
    }
    ShowToastEvent(){
        const event = new ShowToastEvent({
            title: '',
            message: 'Account Updated Successfully',
            variant: 'success',
        });
    this.dispatchEvent(event);
    }

    get dynamictitle(){
        if(this.recordId){
            return 'Edit Account Record';
        }
        else{
            return 'Create Account Record';
        }
    }

    get buttonName(){
        if(this.recordId){
            return 'Update Account';
        }
        else{
            return 'Create Account';
    }
    }
    resetHandler(){
        this.accnameval ='';
        this.accwebsiteval ='';
        this.accratingval = '';
    }
}