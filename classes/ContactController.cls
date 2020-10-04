public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [
            SELECT 
                Id, FirstName , LastName, CreditorName__c, MinPaymentPercentage__c, Balance__c
            FROM Contact
            ORDER BY CreatedDate DESC
        ];
    }
}
