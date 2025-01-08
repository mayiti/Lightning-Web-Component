trigger InvoiceTrigger on Invoice__c (after insert, after Update, after delete) {
    if(trigger.IsAfter && (trigger.IsInsert || trigger.IsUpdate || trigger.IsDelete)){
        InvoiceHandler.InvoiceTotalAmount(trigger.new, trigger.old);
    }
}