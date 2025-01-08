public class InvoiceHandler {
    public static void InvoiceTotalAmount(List<Invoice__c> newInv, List<Invoice__c> oldInv){
        Map<Id,Decimal> mapofAmount = new Map<Id,Decimal>();
        Decimal TotalAmount = 0;
        if(newInv != null){
            for(Invoice__c inv : newInv){
                if(inv.AccountId__c != null){
                    mapofAmount.put(inv.AccountId__c, inv.Amount__c);
                }
            }
        }
        if(oldInv != null){
            for(Invoice__c inv : oldInv){
                if(inv.AccountId__c != null){
                    mapofAmount.put(inv.AccountId__c, inv.Amount__c);
                }
            }            
        }
        if(!mapofAmount.IsEmpty()){
            List<Account> alist = [Select Id, Total_Invoiced_Amount__c from Account where Id =: mapofAmount.keyset()];
            List<Invoice__c> ilist = [Select AccountId__c, Amount__c from Invoice__c where AccountId__c =: mapofAmount.keyset()];
            for(Invoice__c i : ilist){
                TotalAmount = TotalAmount + i.Amount__c;
            }
            if(!alist.IsEmpty()){
                for(Account acc : alist){
                    mapofAmount.put(acc.Id,TotalAmount);
                    acc.Total_Invoiced_Amount__c = mapofAmount.get(acc.Id);       
                }
            }
            if(!alist.IsEmpty()){
                update alist;
            }
        }
    }
}