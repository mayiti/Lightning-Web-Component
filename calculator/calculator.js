import { LightningElement } from 'lwc';

export default class Calculator extends LightningElement {
    numberone = "";
    numbertwo = "";
    result = 0;
    displayOutput = false;

    /*changeHandlerNumberOne(event){
        this.numberone = event.target.value;
        console.log("Number 1: ", this.numberone);
        
    }
    changeHandlerNumberTwo(event){
        this.numbertwo = event.target.value;
        console.log("Number 2: ", this.numbertwo);
    }*/

        changeHandler(event){
            let name = event.target.name;
            let value = event.target.value;

            if(name === "number1"){
                this.numberone = value;
            }
            else if(name === "number2"){
                this.numbertwo = value;
        }
    }

    calculateInput(event){
        this.displayOutput = true;
        let {label, value} = event.target;
        if(label === "Add"){
            this.result = parseInt(this.numberone) + parseInt(this.numbertwo);
        }
        else if(label === "Sub"){
            this.result = parseInt(this.numberone) - parseInt(this.numbertwo);
        }
        else if(label === "Mul"){
            this.result = parseInt(this.numberone) * parseInt(this.numbertwo);
        }
        else if(label === "Div"){
            this.result = parseInt(this.numberone) / parseInt(this.numbertwo);
        }

        //reset
        this.numberone = "";
        this.numbertwo = "";
    }

    /*
    addHandler(event){
        this.result = parseInt(this.numberone) + parseInt(this.numbertwo);
    }
    subHandler(event){
        this.result = parseInt(this.numberone) - parseInt(this.numbertwo);
    }
    mulHandler(event){
        this.result = parseInt(this.numberone) * parseInt(this.numbertwo);
    }
    divHandler(event){
        this.result = parseInt(this.numberone) / parseInt(this.numbertwo);
    }*/
}