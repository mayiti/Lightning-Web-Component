trigger AccountTrigger on Account (after insert, after update, before delete) {
    if(trigger.IsAfter && trigger.IsUpdate){
        AccounttoContactHandler.updatemethod(trigger.new , trigger.oldmap);
        AccounttoContactHandler.updateOwner(trigger.new, trigger.oldmap);
        AccounttoContactHandler.sendEmailtoContact(trigger.new, trigger.oldmap);
    }
    else if(trigger.IsAfter && trigger.IsInsert){
        AccounttoContactHandler.insertAccount(trigger.new);
    }
    else if(trigger.IsBefore && trigger.IsDelete){
        AccounttoContactHandler.deleteAccount(trigger.old);
    }
        /*Map<Id,String> mapofAccount = new Map<Id,String>(); 
        for(Account a: trigger.new){
            if(a.Website != trigger.olmap.get(a.Id).Website){
                mapofAccount.put(a.Id,a.Website);
            }
        }
        if(!mapofAccount.IsEmpty()){
            List<Contact> contoupdate = [Select Id, Email,AccountId from Contact where AccountId In : mapofAccount.keyset()];
            //system.debug('contoupdate'+ contoupdate);
            for(Contact con : contoupdate){
                con.Email = mapofAccount.get(con.AccountId);
            }
        
        if(!contoupdate.IsEmpty()){
            update contoupdate;
        }
        }*/
        
    }