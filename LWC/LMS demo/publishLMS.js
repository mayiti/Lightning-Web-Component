import { LightningElement,wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/sendMessage__c';

export default class PublishLMS extends LightningElement {
    @wire(MessageContext)
    messageContext;
    seldesc = '';

    publishHandler(){
        const payload = { lmsData: "This is LMS Demo" };

        publish(this.messageContext, recordSelected, payload);
    }

    unpublishHandler(){
        this.seldesc = ' ';
        const payload = { lmsData: "" };
        
        publish(this.messageContext, recordSelected, payload);
    }

    changeHandler(event){
        const payload = { lmsData: event.target.value };

        publish(this.messageContext, recordSelected, payload);
    }

    
}