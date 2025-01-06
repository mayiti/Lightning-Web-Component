public class OpportunityStatefullBatchClass implements database.Batchable<sObject>, Database.Stateful {
public Decimal totalrevenure = 0;
    public Map<Id, String> opp = new Map<Id, String>();
    public List<String> Oppname = new List<String>();
    public Database.QueryLocator start(Database.BatchableContext bc){
        string query = 'Select Id,Name,Amount from Opportunity where Amount!= null LIMIT 5';
        return Database.getQueryLocator(query);
    }
    public void execute(Database.BatchableContext bc, List<Opportunity> scope){
        for(Opportunity o : scope){
            totalrevenure = totalrevenure + o.Amount;
            opp.put(o.Id, o.Name);
            Oppname.add(o.Name);
        }
        system.debug('totalrevenure '+totalrevenure);
    }
    public void finish(Database.BatchableContext bc){
        system.debug('totalrevenure in finish '+totalrevenure);
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.toAddresses = new String[] {'mayankgupta1327@gmail.com'};
            email.htmlbody = 'Total Opportunity Revenue is '+ totalrevenure+ ' for the follwing Opportunities '+ '\n\n' + Oppname;
        email.subject = 'Opportunity Revenue';
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>{email};
            Messaging.SendEmailResult[] result = Messaging.SendEmail(messages);
    }
}