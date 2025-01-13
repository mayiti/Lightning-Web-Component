public with sharing class CreateOpportunity {
    @AuraEnabled
    public static Id CrateOppoRecord(String oppnameval, String stagenameval, Date closedateval, Decimal oppamountval){
        Opportunity o = new Opportunity(Name = oppnameval, StageName = stagenameval, CloseDate = closedateval, Amount = oppamountval);
        try {
           insert o;
           return o.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}