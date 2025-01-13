import { LightningElement,wire } from 'lwc';
import { createRecord,getRecord } from 'lightning/uiRecordApi';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_NAME from '@salesforce/schema/Opportunity.Name';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import OPPORTUNITY_STAGE from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_CLOSEDATE from '@salesforce/schema/Opportunity.CloseDate';
import OPPORTUNITY_AMOUNT from '@salesforce/schema/Opportunity.Amount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import CrateOppoRecord from '@salesforce/apex/CreateOpportunity.CrateOppoRecord';
export default class CreateOpportunityByImperativeApex extends NavigationMixin(LightningElement) {
    oppnameval ='';
    oppstageval='';
    oppclosedateval=''
    oppamounntval='';

    @wire(getObjectInfo, {
         objectApiName: OPPORTUNITY_OBJECT
    }) oppobjectInfo;

    @wire(getPicklistValues, {
        recordTypeId: "$oppobjectInfo.data.defaultRecordTypeId",
        fieldApiName: OPPORTUNITY_STAGE
    }) oppstagepicklist;

     changeHandler(event){
    let {name,value} = event.target;
    if(name === 'opname'){
        this.oppnameval = value;
        console.log('oppnameval ',this.oppnameval);
    }
    else if(name === 'opstage'){
        this.oppstageval = value;
    }
    else if(name === 'opclosedate'){
        this.oppclosedateval = value; 
        console.log('close date value ',this.oppclosedateval);
    }
    else if(name === 'opamount'){
        this.oppamounntval = value;
    }
}
submitHandler(){
    CrateOppoRecord({
        oppnameval : this.oppnameval,
        stagenameval : this.oppstageval,
        closedateval : this.oppclosedateval,
        oppamountval : this.oppamounntval
    }).then((result)=>{
            console.log('Opportunity Created Successfully ',result);
            let pageref = {
                type: 'standard__recordPage',
                attributes: {
                    recordId: result,
                    objectApiName: OPPORTUNITY_OBJECT.objectApiName,
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
         console.log('Error while Creating Opportunity Record',error);
         const event = new ShowToastEvent({
             title: '',
             message: 'Opportunity Record Failed to Create',
             variant: 'error',
            });
    this.dispatchEvent(event);
    });
}
}