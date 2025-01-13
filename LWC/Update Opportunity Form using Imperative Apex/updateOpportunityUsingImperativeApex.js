import { LightningElement,wire,api } from 'lwc';
import UpdateOppoMethod from '@salesforce/apex/UpdateOpportunityImperatively.UpdateOppoMethod';
import { getRecord,getFieldValue,notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import OPPORTUNITY_Id from '@salesforce/schema/Opportunity.Id';
import OPPORTUNITY_NAME from '@salesforce/schema/Opportunity.Name';
import OPPORTUNITY_STAGE from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_CLOSEDATE from '@salesforce/schema/Opportunity.CloseDate';
import OPPORTUNITY_AMOUNT from '@salesforce/schema/Opportunity.Amount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class UpdateOpportunityUsingImperativeApex extends LightningElement {
    oppnameval ='';
    oppStageval='';
    //oppclosedateval='';
    oppamounntval='';
    @api recordId;

    @wire(getRecord, {
        recordId: "$recordId",
        fields : [OPPORTUNITY_NAME,OPPORTUNITY_STAGE,OPPORTUNITY_AMOUNT]
    }) opprecord({data,error}){
        if(data){
            console.log('Data for Opportunity is ',data);
            this.oppnameval = getFieldValue(data,OPPORTUNITY_NAME);
            this.oppStageval = data.fields.StageName.value;
            //this.oppclosedateval = data.fields.CloseDate.displayValue;
            this.oppamounntval = data.fields.Amount.value;
        }
        else if(error){
            console.log('Error Occured while fetching Opportunity Record ',error);
        }
    }

    @wire(getObjectInfo, {
        objectApiName: OPPORTUNITY_OBJECT
    }) oppobjectInfo;

    @wire(getPicklistValues, {
        recordTypeId: "$oppobjectInfo.data.defaultRecordTypeId",
        fieldApiName: OPPORTUNITY_STAGE
    }) oppstagepicklist;

    chageHandler(event){
        let{ name,value } = event.target;
        if(name === 'opname'){
            this.oppnameval = value;
        } 
        else if(name === 'opstage'){
            this.oppStageval = value;
        }
        //else if(name === 'opclosedate'){
        //    this.oppclosedateval = value;
      //  }
        else if(name === 'opamount'){
            this.oppamounntval = value;
        }
}

    submitHandler(){
        UpdateOppoMethod({
            recordId: this.recordId,
            Name: this.oppnameval,
          //  CloseDate: this.oppclosedateval,
            StageName: this.oppStageval,
            Amount: this.oppamounntval
        }).then((result)=>{
                console.log('Result is ',result);
                notifyRecordUpdateAvailable([{recordId: this.recordId}]);
                this.showToast();
        }).catch((error)=>{
            console.log('Error is ',error);

        });
}
showToast(){
    const event  = new ShowToastEvent({
        title: '',
        message: 'Opportunity Update Successfully',
        variant: 'success'
    });
    this.dispatchEvent(event);
}
}