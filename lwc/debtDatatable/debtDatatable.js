import { LightningElement, wire } from 'lwc';
import getDebtList from '@salesforce/apex/DebtDatatableController.getDebtList';
import deleteDebts from '@salesforce/apex/DebtDatatableController.deleteDebts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLS = [
    { label: 'Creditor', fieldName: 'CreditorName__c', type: 'text' },
    { label: 'First Name', fieldName: 'FirstName__c', type: 'text' },
    { label: 'Last Name', fieldName: 'LastName__c', type: 'text' },    
    { label: 'Min Pay%', fieldName: 'minPayPercentage', type: 'percent', typeAttributes:{ maximumFractionDigits: 4 }},
    { label: 'Balance', fieldName: 'Balance__c', type: 'currency' }
];

export default class debtDatatable extends LightningElement {
    error;
    debtList;
    columns = COLS;
    fields;
    showModal = false;
    noOfRecords;
    wiredResult;
    countSelectedRows = 0;
    totalBalance = 0;
    selectedIds = [];

    // Get records from database and calculate total number of rows and total balance
    @wire(getDebtList)
    wiredDebts(result) {
        this.wiredResult = result;
        if (result.data) {
            this.debtList = result.data;
            this.error = undefined;
            this.noOfRecords = this.debtList.length;
            var tempTotalBalance = 0;
            var tempRecordList = [];
            for (var i = 0; i < this.debtList.length; i++) {  
                tempTotalBalance = tempTotalBalance + this.debtList[i].Balance__c;
                let tempRecord = Object.assign({}, result.data[i]);
                tempRecord.minPayPercentage = tempRecord.MinPaymentPercentage__c/100;
                tempRecordList.push(tempRecord);
            } 
            this.totalBalance = tempTotalBalance;
            this.debtList = tempRecordList;
            this.showModal = false;
        } else if (result.error) {
            this.error = result.error;
            this.debtList = undefined;
        }
    }

    // Display record create modal upon button click
    handleAddDebt(){
        this.showModal = true;
    }

    // Count selected rows
    handleRowSelection(event){
        var selectedRows = event.detail.selectedRows;
        this.countSelectedRows = selectedRows.length;
        this.selectedIds = event.detail.selectedRows.map(element => element.Id );
    }

    // Delete record(s) from database
    handleDelete(event) {   
        if(this.selectedIds.length > 0) {
            deleteDebts({debtIds: this.selectedIds})
            .then(result => {
                this.dispatchEvent(
                new ShowToastEvent({
                    title: "Success",
                    message: "Record(s) deleted",
                    variant: "success"
                })
                );
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error deleting record",
                    message: "Error",
                    variant: "error"
                })
                );
            });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Warning",
                    message: "Select record(s) to be deleted",
                    variant: "warning"
                })
            );
        } 
    }

    // Call @wire method again using refreshApex
    handleRecordCreate(event){
        return refreshApex(this.wiredResult);
    }

    handleRecordCancel(event){
        this.showModal = false;
    }
}