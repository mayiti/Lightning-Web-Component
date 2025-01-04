public class OpportunityHandler {
    public static void Amountvalidation(List<Opportunity> newOpp){
        system.debug('Under Amountvalidation method');
        List<Opportunity> oplist = new List<Opportunity>();
        for(Opportunity o : newOpp){
            if(o.Amount == null){
                o.Amount.addError('Amount cannot be empty while creating Opportunity');
            }
        }
    }
    public static void StageValidation(List<Opportunity> newOpp, Map<Id,Opportunity> oldOpp){
        List<Opportunity> oplist = new List<Opportunity>();
        //Map<Id,Opportunity> oldmp = new Map<Id,Opportunity>();
        for(Opportunity o : newOpp){
            if(String.IsBlank(o.Description) && (o.StageName == 'Closed Lost' && (o.StageName != oldOpp.get(o.Id).StageName || (oldOpp.get(o.Id).StageName == 'Closed Lost' && o.StageName == oldOpp.get(o.Id).StageName)))){
                o.Description.addError('When Stage is Closed Lost description should not be empty');
            }
        }
    }
    public static void DeleteOpportunity(List<Opportunity> oldopp){
        system.debug('Under Delete method');
        Id profileId = UserInfo.getProfileId();
        String profilename = [Select Name from Profile where Id =: profileId].name;
        for(Opportunity opp : oldopp){
            if(opp.StageName.Contains('Closed') && profilename != 'System Administrator'){
                system.debug('Profile '+profilename);
                opp.addError('Only Admin can delete Opportunity when Stage Contain Closed');
            }
        }
    }
    public static void AddAllAmount(List<Opportunity> newOpp, List<Opportunity> oldOpp){
        system.debug('Under AddAllAmount method');
        Map<Id,Decimal> mapofAmount = new Map<Id,Decimal>();
        Decimal SumAmount = 0;
        if(newOpp != null){
            system.debug('Under newOpp '+newOpp);
            for(Opportunity o : newOpp){
                if(o.Amount != null){
                    mapofAmount.put(o.AccountId, 0);
                }
            }
        }
        else if(oldOpp != null){
            system.debug('Under oldOpp '+oldOpp);
            for(Opportunity o: oldOpp){
                mapofAmount.put(o.AccountId, 0);
            }
        }
        List<Account> acclist = [Select Id, AnnualRevenue from Account where Id IN: mapofAmount.keyset()];
        List<Opportunity> opplists = [Select Id, Amount from Opportunity where AccountId IN: mapofAmount.keyset()];
        System.debug('Total Opportunity '+opplists);
        System.debug('Total Opportunity size '+opplists.size());
        for(Opportunity o : opplists){
            if(o.Amount !=null){
                SumAmount += o.Amount;
            }            
        }
        for(Account a : acclist){
            mapofAmount.put(a.Id, SumAmount);
            system.debug('mapofAmount '+ mapofAmount);
            a.AnnualRevenue = mapofAmount.get(a.Id);
        }
        if(!acclist.IsEmpty()){
            update acclist;
        }
    }
    public static void UpdateMultiPicklist(List<Opportunity> newOpp){
        system.debug('Under UpdateMultiPicklist method');
        Map<Id,String> mapofPicklist = new Map<Id,String>();
        if(newOpp != null){
            for(Opportunity o : newOpp){
                if(o.AccountId != null){
                    mapofPicklist.put(o.AccountId,o.Interview_field__c);
                }
            }
        }
        if(!mapofPicklist.IsEmpty()){
            List<Account> acc = [Select Id, Interview_field__c from Account where Id IN: mapofPicklist.keyset()];
            for(Account a : acc){
                if(!mapofPicklist.IsEmpty()){
                    a.Interview_field__c = mapofPicklist.get(a.id);
                }
            }
            
            if(!acc.IsEmpty()){
                update acc;
            }
        }
    }
}