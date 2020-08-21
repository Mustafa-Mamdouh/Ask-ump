export class Constants {
    jiraBaseUrl = '/rest/api'
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
	