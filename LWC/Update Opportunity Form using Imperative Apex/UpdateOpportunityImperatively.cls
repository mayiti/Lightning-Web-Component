public with sharing class UpdateOpportunityImperatively {
    @AuraEnabled
    public static string UpdateOppoMethod(String recordId, String Name, String StageName, Double Amount){
        Opportunity opp = new Opportunity(Id = recordId, Name = Name, StageName = StageName, Amount = Amount);
        try {
            update opp;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}