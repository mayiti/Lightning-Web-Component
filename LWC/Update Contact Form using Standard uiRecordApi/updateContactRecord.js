import { LightningElement,api,wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_Id from '@salesforce/schema/Contact.Id';
import CONTACT_NAME from '@salesforce/schema/Contact.Name';
import CONTACT_DESCRIPTION from '@salesforce/schema/Contact.Description';
import CONTACT_PHONE from '@salesforce/schema/Contact.Phone';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const fieldtoLoad = [CONTACT_PHONE,CONTACT_DESCRIPTION];

export default class UpdateContactRecord extends LightningElement {
    //conname='';
    conphone='';
    condesc='';
    @api recordId;
    @wire(getRecord, {recordId: "$recordId", fields: fieldtoLoad})
    wired_getcontact({error, data}){
        if(data){
           // this.conname = data.fields.Name.value;
            this.conphone = data.fields.Phone.value;
            this.condesc = data.fields.Description.value;
        }
     else if(error){
        console.log('error occured while fetching Contact Record ',error);
    }
}
    changeHandler(event){
        let{name,value} = event.target;
      //  if(name === 'cname'){
       //     this.conname = value;
      //  }
       if(name === 'cphone'){
            this.conphone = value;
        }
        else if(name === 'cdesc'){
            this.condesc = value;
        }
    }

    submitHandler(){
        let inputfields = {};
       // inputfields[CONTACT_NAME.fieldApiName] = this.conname;
        inputfields[CONTACT_PHONE.fieldApiName] = this.conphone;
        inputfields[CONTACT_DESCRIPTION.fieldApiName] = this.condesc;
        if(this.recordId){
        inputfields[CONTACT_Id.fieldApiName] = this.recordId;
        
        let recordInput = {
            fields: inputfields
        };

        updateRecord(recordInput).then((result)=>{
            console.log('Record Updated Successfully',result);
            this.showtoast();
        }).catch((error)=>{
            console.log('Error while Updating Record',error);
        });
} else{
    console.log('Record Id not Present');
}
}
showtoast(){
        const event = new ShowToastEvent({
            title: '',
            message: 'Contact Record Updated Successfully',
            variant: 'success',
        });
        this.dispatchEvent(event);
}
}