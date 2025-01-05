import { LightningElement,wire } from 'lwc';
import fetchClosedOpportunitymethod from '@salesforce/apex/FetchClosedOpportunity.fetchClosedOpportunitymethod';
const columns = [
    {label: 'Name', fieldName: 'Name', type: 'text', sortable: true},
    {label: 'Stage', fieldName: 'StageName', type: 'text', sortable: true},
    {label: 'Amount', fieldName: 'Amount', type: 'number', sortable: true},
    {label: 'Close Date', fieldName: 'CloseDate', type: 'date', sortable: true},
];
export default class ClosedWonOpportunity extends LightningElement {
    closeOpp = 0;
    Opportunity = [];
    totalSum = 0;
    columns = columns;
    @wire(fetchClosedOpportunitymethod) wiredOpportunity ({data,error}){
        if(data){
            this.closeOpp = data.length;
            this.Opportunity = data;
            console.log(this.Opportunity);
            for(let i=0;i<data.length;i++){
                this.totalSum = this.totalSum + data[i].Amount;
            }
            console.log(this.totalSum);
        }
        else if(error){
            console.log(error);
        }
    }
}