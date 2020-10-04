import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import { refreshApex } from '@salesforce/apex';

const COLS = [
    { label: 'Creditor', fieldName: 'CreditorName__c', type: 'text', sortable: true },
    { label: 'First Name', fieldName: 'FirstName', type: 'text', sortable: true },
    { label: 'Last Name', fieldName: 'LastName', type: 'text', sortable: true },    
    { label: 'Min Pay%', fieldName: 'MinPaymentPercentage__c', type: 'number', sortable: true },
    { label: 'Balance', fieldName: 'Balance__c', type: 'currency', sortable: true }
];

export default class DatatableExample extends LightningElement {
    error;
    contactList ;
    columns = COLS;
    fields;
    showModal = false;
    noOfRecords;
    wiredResult;
    countSelectedRows = 0;
    totalBalance = 0;

    @wire(getContactList)
    wiredDebts(result) {
        this.wiredResult = result;
        if (result.data) {
            this.contactList = result.data;
            this.error = undefined;
            this.noOfRecords = this.contactList.length;
            var tempTotalBalance = 0;
            for (var i = 0; i < this.contactList.length; i++) {  
                tempTotalBalance = tempTotalBalance + this.contactList[i].Balance__c;
            } 
            this.totalBalance = tempTotalBalance;
            console.log(JSON.stringify(result.data));
        } else if (result.error) {
            this.error = result.error;
            this.contactList = undefined;
        }
    }

    handleAddDebt(){
        this.showModal = true;
    }

    handleRowSelection(event){
        var selectedRows = event.detail.selectedRows;
        this.countSelectedRows = selectedRows.length;
    }

    handleRecordCreate(event){
        console.log('Event details: ' + JSON.stringify(event.detail));
        return refreshApex(this.wiredResult);
    }

}