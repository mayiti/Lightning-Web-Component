public class ContactHandler {
    public static void CountleftContact(List<Contact> conlist, List<Contact> newanddelcon){
        Map<Id,Integer> mapofAccount = new Map<Id,Integer>();
        if(conlist != null){
            for(Contact c : conlist){
                if(c.AccountId != null){
                    mapofAccount.put(c.AccountId,0);
                }
            }
        }
        if(newanddelcon != null){
            for(Contact c: newanddelcon){
                if(c.AccountId != null){
                    mapofAccount.put(c.AccountId,0);
                }
            }
        }
        
        List<Account> acc = [Select Name,NumberOfEmployees from Account Where Id =: mapofAccount.keyset()];
        List<Contact> con = [Select Id from Contact where AccountId =: mapofAccount.keyset()];
        
        for(Account a : acc){
            mapofAccount.put(a.Id,con.size());
            a.NumberOfEmployees = mapofAccount.get(a.Id);
        }
        if(!acc.IsEmpty()){
            update acc;
        }
    }
    public static void preventduplicateEmail(List<Contact> conlist){
        Set<String> email = new Set<String>();
        for(Contact c : conlist){
            if(c.Email != null){
                email.add(c.Email);
            }
        }
        List<Contact> contlist = [Select Id, email from Contact where Email =: email];
        if(!contlist.IsEmpty()){
            for(Contact c : conlist){
                c.Email.addError('Email already exist');
                
            }
        }
    }
}