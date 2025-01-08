public with sharing class ProjectHandler {
    public static void UpdateOpportunityStage(List<Project__c> newPrj, List<Project__c> oldPrj){
        Set<Id> Ids = new Set<Id>();
        Integer flag = 0;
        if(newPrj != null){
            for(Project__c prj : newPrj){
                if(prj.OpportunityId__c != null){
                    Ids.add(prj.OpportunityId__c);
                }
            }
        }
        if(oldPrj != null){
            for(Project__c prj : oldPrj){
                if(prj.OpportunityId__c != null){
                    Ids.add(prj.OpportunityId__c);
                }
            }
        }
        if(Ids != null){
            List<Opportunity> oplist = [Select Id, StageName from Opportunity where Id =: Ids];
            List<Project__c> prjlist = [Select Id, Status__c,OpportunityId__c from Project__c where OpportunityId__c =: Ids];
            List<Project__c> closprjlist = [Select Id, Status__c,OpportunityId__c from Project__c where Status__c = 'Closed' AND OpportunityId__c =: Ids];
            for(Opportunity o : oplist){
                if(closprjlist == prjlist){
                    o.StageName = 'Closed Won';
                }
            }
            If(!oplist.IsEmpty()){
                update oplist;
            }
        }
    }
}