import { LightningElement,api } from 'lwc';

export default class TestKnowledgeAboutCommunicationTwo extends LightningElement {
    @api display;

    handleChange(event){
       
        let mycustomEvent = new CustomEvent('childmessage',{detail:{'message':event.target.value}});
        this.dispatchEvent(mycustomEvent);
    }
        
}