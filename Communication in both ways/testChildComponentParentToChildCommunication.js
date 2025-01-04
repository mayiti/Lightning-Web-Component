import { LightningElement, api } from 'lwc';

export default class TestChildComponentParentToChildCommunication extends LightningElement {
    @api display;
    @api message;

}