trigger OpportunityAmountValidation on Opportunity (before insert, before update, before delete, after update, after insert, after delete) {
    if(trigger.IsInsert && trigger.IsBefore){
        OpportunityHandler.Amountvalidation(trigger.new);
    }
    else if(trigger.IsUpdate && trigger.IsBefore){
        OpportunityHandler.StageValidation(trigger.new, trigger.oldmap);
    }
    else if(trigger.IsBefore && trigger.IsDelete){
        OpportunityHandler.DeleteOpportunity(trigger.old);
    }
    else if(trigger.IsAfter && (trigger.IsInsert || trigger.IsUpdate || trigger.IsDelete)){
        OpportunityHandler.AddAllAmount(trigger.new, trigger.old);
        OpportunityHandler.UpdateMultiPicklist(trigger.new);
        OpportunityHandler.SendEmailToManager(trigger.new);
    }
}
