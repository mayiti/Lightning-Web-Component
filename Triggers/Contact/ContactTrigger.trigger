trigger ContactTrigger on Contact (after insert, after delete, after undelete, before insert, before update) {
    if(trigger.IsAfter && (trigger.IsDelete || trigger.IsInsert || trigger.IsUndelete)){
	ContactHandler.CountleftContact(trigger.old, trigger.new);
    }
    else if(trigger.IsBefore && (trigger.IsInsert || trigger.IsUpdate)){
        ContactHandler.preventduplicateEmail(trigger.new);
    }
}