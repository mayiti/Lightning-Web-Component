trigger ProjectTigger on Project__c (after update, after Insert, after Delete) {
    if(trigger.IsAfter && (trigger.IsUpdate || trigger.IsInsert || trigger.IsDelete)){
        ProjectHandler.UpdateOpportunityStage(trigger.new, trigger.old);
    }
}