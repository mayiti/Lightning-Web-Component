import { LightningElement,api,wire } from 'lwc';
import DeleteContact from '@salesforce/apex/DeleteContactRecords.DeleteContact';
import { getRecord,getFieldValue,notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
//import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class DeleteContactRecords extends LightningElement {
    @api recordId;
    //NoofRecords = '';
     sInteger = '';
    @wire(getRecord,{
        recordId: "$recordId",
        fields : [ACCOUNT_NAME]
    }) wired_contact({data,error}){
        if(data){
            console.log('Data for deletion Contact ', data);
            console.log('Data for deletion Contact Account Id ', this.recordId);
        } else if(error){
            console.log('Error while fetching Contact to Delete ',error);
        }
    }
    value = [];
    get options() {
        return [
            {label: '1', value: '1'},
            {label: '5', value: '5'},
            {label: '10', value: '10'},
            {label: '20', value: '20'},
        ];
    }
    changeHandler(event){
        this.value = event.detail.value;
        console.log('selected value is '+this.value);
        this.sInteger = this.value.toString();
        console.log('selected value is '+this.sInteger);
    }
    
    deleteHandler(){
        DeleteContact({
            recordId: this.recordId,
            NoofRecords: this.sInteger
        }).then((result)=>{
            console.log('Contact Deleted Successfully ',result);
            notifyRecordUpdateAvailable([{recordId: this.recordId}]);
            this.showToast();
        }).catch((error)=>{
            console.log('Error occur while deleting Records ',error);
        })
    }
    showToast(){
        const event  = new ShowToastEvent({
                title: 'Deleted Successfully',
                message: this.value + ' Contacts Deleted Successfully',
                variant: 'success' 
            });
            this.dispatchEvent(event);
        
    }
}