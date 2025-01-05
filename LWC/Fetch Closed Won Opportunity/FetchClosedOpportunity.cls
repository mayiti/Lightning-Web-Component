public with sharing class FetchClosedOpportunity {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> fetchClosedOpportunitymethod(){
        return [SELECT Name,StageName, Amount, CloseDate FROM Opportunity WHERE StageName = 'Closed Won' WITH SECURITY_ENFORCED LIMIT 5];
    }
}