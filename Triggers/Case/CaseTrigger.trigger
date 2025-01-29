trigger CaseTrigger on Case (after update) {
if(trigger.IsAfter && trigger.IsUpdate){
CaseHandler.AccountRating(trigger.new, trigger.oldmap);
}
}