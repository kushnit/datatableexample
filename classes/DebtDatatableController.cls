public with sharing class DebtDatatableController {

    @AuraEnabled(cacheable=true)
    public static List<Debt__c> getDebtList() {
        return [
            SELECT 
                Id, FirstName__c , LastName__c, CreditorName__c, MinPaymentPercentage__c, Balance__c
            FROM Debt__c
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void deleteDebts(Id[] debtIds){
        delete [
            SELECT 
                Id  
            FROM Debt__c 
            WHERE Id IN: debtIds
        ];
    }
}
