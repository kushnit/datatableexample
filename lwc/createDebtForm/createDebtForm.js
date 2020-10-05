import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateDebtForm extends LightningElement {
    showModal = true;

    // Overriding the default behavior so that button can be placed anywhere as desired
    handleSubmit(event) {
        event.preventDefault(); 
        this.fields = event.detail.fields;
    }
    
    handleSave(){
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
    }

    handleSuccess(event) {      
        // Display toast message on UI for the user
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!!',
                message: 'Record created successfully!!',
                variant: 'success'
            })
        ); 
        
        // Dispatch an event for Parent component to listen
        const recordcreateevent = new CustomEvent("recordcreate", { detail: event.detail });
        this.dispatchEvent(recordcreateevent);

        this.showModal = false;
    }

    handleCancel(event){
        // Dispatch an event for Parent component to listen
        const canceleevent = new CustomEvent("cancelcreate", { detail: event.detail });
        this.dispatchEvent(canceleevent);

        this.showModal = false;
    }
}