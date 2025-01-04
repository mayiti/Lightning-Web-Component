import { LightningElement,api } from 'lwc';

export default class TestKnowledgeAboutCommunicationOne extends LightningElement {

    message = ' ';
    handleChange(event){
        this.message = event.target.value;
    }

    testme(event){
        this.message = event.detail.message;
    }
}