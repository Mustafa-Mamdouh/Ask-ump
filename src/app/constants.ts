export class Constants {
    jiraBaseUrl = '/rest/api';
    jiraUrlNative='https://jira01.corp.linkedin.com:8443/browse/';

    public urls = {
        getAllMetadata:this.jiraBaseUrl + '/2/issue/createmeta',
        postTicketUrl: this.jiraBaseUrl + '/2/issue',
        uploadAttachment:this.jiraBaseUrl + '/2/issue'
    }
    public authenticationParameters={
        email:'ayoussef',
        apiToken:'Totti111Pirlo'
    }
    public successMessages = { postTicketSuccess: 'Ticked Added' }
}
	