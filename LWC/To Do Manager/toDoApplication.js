import { LightningElement } from 'lwc';

export default class ToDoApplication extends LightningElement {
    taskname = '';
    taskdate = null;
    incompletetask = [];
    completeTask = [];
    changeHandler(event){
        let{name, value} = event.target;
        if(name === 'taskname'){
            this.taskname = value; 
        }
        else if(name === 'taskdate'){
            this.taskdate = value;
        }
        console.log(this.taskname, this.taskdate);
    }

    resetHandler(){
        this.taskname = '';
        this.taskdate = null;
    }

    addTaskHandler(){
        if(!this.taskdate){
            this.taskdate = new Date().toISOString();
        }

    if(this.validateTask()){
        this.incompletetask = [...this.incompletetask,{
            taskname : this.taskname,
            taskdate : this.taskdate
        }];
        this.resetHandler();
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask = [...sortedArray];
    }
    }

    validateTask(){
        let isValid = true;
        let element = this.template.querySelector(".taskname");

        //codition 1: check if task is empty
        if(!this.taskname){
            isValid = false;
            this.template.querySelector('.taskname').setCustomValidity('Kindly Enter Task Name');
        }
        //condition 2: check for duplicate value
        else{
            //if find method, will find an array it will return task item if not found, it will return undefined
            let taskItem = this.incompletetask.find((currItem) => currItem.taskname === this.taskname && ((currItem.taskdate === this.taskdate) || (new Date().toISOString() === this.taskdate)));

            if(taskItem){
                isValid = false;
                element.setCustomValidity('Task is already available');
            }
        }

        if(isValid){
            element.setCustomValidity('');
        }
        element.reportValidity();
        return isValid;
    }

    sortTask(inputArr){
        let sortedArray = inputArr.sort((a,b) =>{
            const dateA = new Date(a.taskdate);
            const dateB = new Date(b.taskdate);
            return dateA - dateB;
        });
        return sortedArray;
    }

    removalHandler(event){
        //remove the item from array
        let index = event.target.name;
        this.incompletetask.splice(index, 1);
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask = [...sortedArray];
    }
    completetaskHandler(event){
        //remove the entry from incomplete item
        let index = event.target.name;
        this.refreshData(index);
    }

    dragStartHandler(event){
        event.dataTransfer.setData("index", event.target.dataset.item);
    }

    allowDrop(event){
        event.preventDefault();
    }
    dropElementHandler(event){
        let index = event.dataTransfer.getData("index");
        this.refreshData(index);
    }

    refreshData(index){
        let removeItem = this.incompletetask.splice(index, 1);
        let sortedArray = this.sortTask(this.incompletetask);
        this.incompletetask = [...sortedArray];
        //add the same entry to compltet item array
        this.completeTask = [...this.completeTask, removeItem[0]];
    }
}