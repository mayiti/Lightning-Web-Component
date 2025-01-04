public class AccounttoContactHandler {
    public static void updatemethod(List<Account> newacc, Map<Id,Account> oldacc){
        Map<Id,String> mapofAccount = new Map<Id,String>(); 
        Map<Id,String> mapofAccount1 = new Map<Id,String>();
        Map<Id,Account> mapofAccount2 = new Map<Id,Account>();
        Map<Id,Account> mapofAccount3 = new Map<Id,Account>();
        
        for(Account a: newacc){
            Account oldaccmap = oldacc.get(a.Id);
            if(a.Website != oldaccmap.Website || a.Phone != oldacc.get(a.Id).Phone || (a.BillingCountry !=oldacc.get(a.Id).BillingCountry || a.BillingCity != oldacc.get(a.Id).BillingCity) || (a.IsActive__c != oldacc.get(a.Id).IsActive__c && a.IsActive__c == true)){
                mapofAccount.put(a.Id,a.Website);
                mapofAccount1.put(a.Id,a.Phone);
                mapofAccount2.put(a.Id,a);
                mapofAccount3.put(a.Id,a);
            }
        }
        
        if(!mapofAccount.IsEmpty() || !mapofAccount1.IsEmpty() || !mapofAccount2.IsEmpty() || !mapofAccount3.IsEmpty()){
            List<Contact> contoupdate = [Select Id, Email,AccountId,Description,MailingCountry,MailingCity from Contact where AccountId In : mapofAccount.keyset() LIMIT 5];
            List<Opportunity> oplist = [Select Id,AccountId,StageName from Opportunity where AccountId IN: mapofAccount3.keyset()];
            
            for(Contact con : contoupdate){
                con.Email = mapofAccount.get(con.AccountId);
                con.Description = mapofAccount1.get(con.AccountId);
                con.MailingCountry = mapofAccount2.get(con.AccountId).BillingCountry;
                con.MailingCity = mapofAccount2.get(con.AccountId).BillingCity;
            }
            if(!oplist.IsEmpty()){
                for(Opportunity o : oplist){
                    if(o.StageName != 'Closed Won'){
                        o.StageName = 'Closed Lost';
                    }
                }
            }
            
            if(!contoupdate.IsEmpty()){
                update contoupdate;
            }
            if(!oplist.IsEmpty()){
                update oplist;
            }
        }
    }
    public static void updateOwner(List<Account> newacc, Map<Id,Account> oldmapacc){
        Map<Id,Id> mapofIds = new Map<Id,Id>();
        for(Account acc : newacc){
            Account oldacc = oldmapacc.get(acc.Id);
            if(acc.OwnerId != oldacc.OwnerId){
                mapofIds.put(acc.Id,acc.OwnerId);
            }
        }
        if(!mapofIds.IsEmpty()){
            List<Contact> conlist = [Select Id, OwnerId,AccountId from Contact where AccountId =: mapofIds.keyset()];
            for(Contact c : conlist){
                c.OwnerId = mapofIds.get(c.AccountId);
            }
            if(!conlist.IsEmpty()){
                update conlist;
            }
        }
    }
    public static void sendEmailtoContact(List<Account> newacc, Map<Id,Account> oldmapAcc){
        List<Contact> conlist = new List<Contact>();
        Set<Id> accId = new Set<Id>();
        Set<String> conEmail = new Set<String>();
        String emailbody = ' '; 
        String conEmailconvert = ' ';
        
        if(!newacc.IsEmpty()){
            for(Account acc : newacc){
                if(acc.Type != oldmapAcc.get(acc.Id).Type){
                    accId.add(acc.Id);
                    emailbody = acc.Name;
                }   
            }
        }
        
        conlist = [Select Id, Email from Contact where AccountId IN: accId];
        if(!conlist.IsEmpty()){
            for(Contact c : conlist){
                if(c.Email != null){
                    conEmail.add(c.Email);
                    system.debug('Contact Email '+ c.Email);
                }
            }
            system.debug('conEmail '+conEmail);
            //conEmailconvert = string.valueof(conEmail).replace('{', '').replace('}', '');
            conEmailconvert = string.join(New List<String>(conEmail),',');
            System.debug('conEmailconvert '+ conEmailconvert);
        }
        //Send Email
        Messaging.SingleEmailMessage messages= new Messaging.SingleEmailMessage();
        list <String> toAddresses = new list<String>();
        toAddresses.add(conEmailconvert);
        System.debug(toAddresses);
        messages.setToAddresses(toAddresses);
        messages.htmlbody = 'Your Account information has been updated successfully. Account Name: '+ emailbody;
        messages.Subject = 'Account Update';
        messaging.SingleEmailMessage[] message = new List<messaging.SingleEmailMessage>{messages};
            messaging.sendEmailResult[] result = messaging.SendEmail(message);
    }
    public static void insertAccount(List<Account> newacc){
        List<Contact> conlist = new List<Contact>();
        List<Opportunity> opplist = new List<Opportunity>();
        for(Account acc : newacc){
            if(acc.Contact__c == true){
                Contact c = new Contact();
                c.AccountId = acc.Id;
                c.FirstName = acc.Name;
                c.LastName = ' from Checkbox';
                conlist.add(c);
            }
            if(acc.Opportunity__c == true && acc.IsActive__c == true){
                Opportunity o = new Opportunity();
                o.AccountId = acc.Id;
                o.Name = acc.Name + ' from Checkbox';
                o.StageName = 'Value Proposition';
                o.CloseDate = system.today();
                opplist.add(o);
            }
        }
        if(!conlist.IsEmpty() || !opplist.IsEmpty()){
            try{
                insert conlist;
                insert opplist;
            }catch(Exception e){
                system.debug('Contact not Inserted '+e.getMessage());
                system.debug('Opportunity not Inserted '+e.getMessage());
            }
        }
    }
    public static void deleteAccount(List<Account> oldacc){
        List<Account> acclist = new List<Account>();
        Id profileId = UserInfo.getProfileId();
        String profilename = [Select Name from Profile where Id =: profileId].Name;
        system.debug('profilename '+profilename);
        Set<Id> Ids = new Set<Id>();
        for(Account a : oldacc){
            Ids.add(a.Id);
        }
        List<Contact> conlist = [Select Id from Contact where AccountId IN: Ids];
        for(Account a : oldacc){
            if(!conlist.IsEmpty() && profilename == 'System Administrator' ){
                a.addError('Noooo you cannot delete Account as there are Contacts Available');
            }
        }
    }
}