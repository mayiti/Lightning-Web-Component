trigger CaseTrigger on Case (after update, after Insert) {
if(trigger.IsAfter && (trigger.IsUpdate || trigger.IsInsert)){
CaseHandler.AccountRating(trigger.new, trigger.oldmap);
}
}
