trigger ContactTrigger on Contact (after insert, after delete, after update, after undelete, before insert, before update) {
    if(trigger.IsAfter && (trigger.IsDelete || trigger.IsInsert || trigger.IsUndelete || trigger.IsUpdate)){
	ContactHandler.CountleftContact(trigger.old, trigger.new);
        ContactHandler.ConcatContactName(trigger.new, trigger.old);
    }
    else if(trigger.IsBefore && (trigger.IsInsert || trigger.IsUpdate)){
        ContactHandler.preventduplicateEmail(trigger.new);
    }
}
