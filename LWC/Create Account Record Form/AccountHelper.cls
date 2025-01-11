public with sharing class AccountHelper {
   @AuraEnabled(cacheable = true)
    public static List<Account> getAccountlist(String inputIndustry){
        return [Select Id, Name, Industry, Rating from Account where AnnualRevenue != null AND Industry =: inputIndustry With USER_MODE];
    }

    @AuraEnabled
    public static string updateAccount(String recordId, String ticketsym){
        Account acc = new Account(Id = recordId, TickerSymbol = ticketsym);
        try {
            update acc;
            return 'Success';
        } catch (Exception e) {
           return (e.getMessage());
        }
    }

    @AuraEnabled
    public static string updateAccountWebsite(String recordId, String accwebsite){
        Account acc = new Account(Id= recordId, Website = accwebsite);
        try {
            update acc;
            return 'Success';
        } catch (Exception e) {
            return (e.getMessage());
        }
    }
    @AuraEnabled
    public static Id createAccount(String accnameval, String accwebsiteval, String accratingval){
        Account acc = new Account(Website = accwebsiteval, Name = accnameval, Rating = accratingval);
        try {
            insert acc;
            return acc.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
           
        }
    }
}