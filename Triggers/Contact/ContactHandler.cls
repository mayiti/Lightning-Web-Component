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
        
        List<Account> acc = [Select Name,NumberOfEmployees,OwnerId from Account Where Id =: mapofAccount.keyset()];
        List<Contact> con = [Select Id from Contact where AccountId =: mapofAccount.keyset()];
        
        for(Account a : acc){
            mapofAccount.put(a.Id,con.size());
            a.NumberOfEmployees = mapofAccount.get(a.Id);
            List<String> emailaddress = new List<String>();
            User u = [Select Email from User where Id =: a.OwnerId];
            if(con.size() == 0){
                system.debug('User Email '+ u.Email);
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.Subject = 'No Contact Left for Account '+ a.Name;
                email.htmlbody = 'All Contacts has been deleted for Account '+ a.Name;
                email.toaddresses = new String[] {u.Email};
                    Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>{email};
                        Messaging.SendEmailResult[] result = Messaging.SendEmail(messages);
                if(result[0].success){
                    system.debug('Email Send Successfully');
                }
                else{
                    system.debug('Error while sending Email');
                }
            }
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
