import { LightningElement } from 'lwc';
import{ getRecord, createRecord} from 'lightning/uiRecordApi';
import CONTACTFIRSTNAME from '@salesforce/schema/Contact.FirstName';
import CONTACTLASTNAME from '@salesforce/schema/Contact.LastName';
import CONTACTDESCRIPTION from '@salesforce/schema/Contact.Description';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
export default class CreateContactForm extends NavigationMixin(LightningElement) {
    firstname = '';
    lastname = '';
    descvalue = '';
    changeHandler(event){
    let{name,value} = event.target;
    if(name === 'fname'){
        this.firstname = value;
    }
    else if(name === 'lname'){
        this.lastname = value;
    }
    else if(name === 'desc'){
        this.descvalue = value;
    } 
    }

    submitHandler(){
       let inputfields = {};
       inputfields[CONTACTFIRSTNAME.fieldApiName] = this.firstname;
       inputfields[CONTACTLASTNAME.fieldApiName] = this.lastname;
       inputfields[CONTACTDESCRIPTION.fieldApiName] = this.descvalue;
       
       let recordInput = {apiName: CONTACT_OBJECT.objectApiName, fields: inputfields};

       createRecord(recordInput).then((result)=>{
        console.log('Contact Record Created Successfully', result);
        let pageref = {
            type: 'standard__recordPage',
            attributes: {
                recordId: result.id,
                objectApiName: CONTACT_OBJECT.objectApiName,
                actionName: 'view'
            }
        };
        this[NavigationMixin.Navigate](pageref);

        const event = new ShowToastEvent({
            title: '',
            message: 'Contact Record Created Successfully',
            variant: 'success',
        });
        this.dispatchEvent(event);

       }).catch((error)=>{
        console.log('Error while Creating Contact Record', error);
        const event = new ShowToastEvent({
            title: '',
            message: 'Contact Record Failed to Create',
            variant: 'error',
        });
        this.dispatchEvent(event);
       })
    }
}