import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateDebtForm extends LightningElement {
    showModal = true;

    handleSubmit(event) {
        event.preventDefault(); 
        this.fields = event.detail.fields;
    }
    
    handleSave(){
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
    }

    handleSuccess(event) {      
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!!',
                message: 'Contact record created successfully!!',
                variant: 'success'
            })
        ); 

        const recordcreateevent = new CustomEvent("recordcreate", { detail: event.detail });
        this.dispatchEvent(recordcreateevent);

        this.showModal = false;
    }

    handleCancel(){
        this.showModal = false;
    }
}