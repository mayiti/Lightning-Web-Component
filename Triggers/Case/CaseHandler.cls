public class CaseHandler {
    public static void AccountRating(List<Case> newcase, Map<Id,Case> mapofCase){
        Set<Id> Ids = new Set<Id>();
        Map<Id,Integer> mapStatus = new Map<Id,Integer>();
        Integer Flag = 0;
        if(!newcase.IsEmpty()){
            for(Case c : newcase){
                Ids.add(c.AccountId);
            }
        }
        if(!Ids.IsEmpty()){
            List<AggregateResult> caslist = [Select AccountId, COUNT(Status) Status from Case where AccountId =: Ids AND Status = 'Escalated' GROUP BY AccountId];
            for(AggregateResult ag : caslist){
                mapStatus.put((Id)ag.get('AccountId'),(Integer)ag.get('Status'));
            }
            List<Account> aclist = new List<Account>();
            for(Id aId: Ids){
                Account acc = new Account(Id = aId);
                if(mapStatus.containskey(aId)){
                    if(mapStatus.get(aId) > 5){
                        acc.Rating = 'Hot';
                    }
                    else if(mapStatus.get(aId) >=3 && mapStatus.get(aId) <=5){
                        acc.Rating = 'Cold';
                    }
                    else if(mapStatus.get(aId) < 3){
                        acc.Rating = 'Warm';
                    }
                    aclist.add(acc);
                    system.debug('aclist '+aclist);
                }
            }
            if(!aclist.IsEmpty()){
                update aclist;
            }
        }
    }
}
