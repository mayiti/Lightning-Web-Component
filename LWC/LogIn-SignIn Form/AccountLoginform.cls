public with sharing class AccountLoginform {
    @AuraEnabled()
    public static Id AccountSigninMethod(String username, String password) {
        List<Account> acc = [Select Id from Account where Username__c =: username AND Password__c =: password WITH USER_MODE LIMIT 1];
        if(!acc.IsEmpty()){
        return acc[0].Id;
        }
        else{
            return null;
        }
    }
    /*@AuraEnabled    we are using standard uiRecorrd approch for creating Account
    public static Id SignupMethod(String Name, String username, String password) {
       
        Account acc = new Account();
        acc.Name = Name;
        acc.Username__c = username;
        acc.Password__c = password;
        try{
        insert acc;
        return acc.Id;
        }
        
       catch(Exception e){
        throw new AuraHandledException(e.getMessage());
       }
    }*/
}