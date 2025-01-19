public with sharing class DeleteContactRecords {
    @AuraEnabled
    public static string DeleteContact(String recordId, String NoofRecords) {
        Map<Id,List<Contact>> contodel = new Map<Id,List<Contact>>();
        List<Contact> delcon = new List<Contact>();
        List<Contact> conlist = new List<Contact>();
        Integer NoofRecordss = Integer.valueOf(NoofRecords);
        system.debug('NoofRecords '+NoofRecords);
        List<Contact> c = [Select Id,Name,AccountId from Contact where AccountId =: recordId LIMIT: NoofRecordss];
        system.debug('Contact '+c);
        for(Contact coo:c){
        conlist.add(coo);
        if(!conlist.isEmpty()){
            contodel.put(coo.AccountId, conlist);
    }
        }
        

    if(!contodel.isEmpty()){
        system.debug('contoDel '+contodel);
        for(List<Contact> ccc: contodel.values()){
            delcon.addAll(ccc);
            system.debug('ccc '+ccc);
        }
        try{
            delete delcon;
            return 'Success from Apex';
        } catch(Exception ex){
            return 'Error occur while deleting Contact ' +ex.getMessage();
        }
    } else{
        return 'No Record found';
    }
}
}