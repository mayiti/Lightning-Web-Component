import { LightningElement } from 'lwc';

export default class GenerateFullName extends LightningElement {
    display = "";
    firstName = "";
    lastName = "";
    namehandler(event){
    let name = event.target.value;
    let label = event.target.label;
    if(label === "First Name"){
        this.firstName = name;
        console.log("First Name ", this.firstName);
    }
    else if(label === "Last Name"){
        this.lastName = name;
        console.log("Last Name ", this.lastName);
    }
}

    generateFullName(event){
        this.display = this.firstName.toUpperCase() + " " + this.lastName.toUpperCase();
        console.log("Display ",this.display)
    }
}