export class Constants {
    jiraBaseUrl = 'https://ask-ump.atlassian.net'
    public urls = {
        getAllMetadata:this.jiraBaseUrl + '/rest/api/2/issue/createmeta',
        postTicketUrl: this.jiraBaseUrl + '/rest/api/2/issue'
    }
    public authenticationParameters={
        email:'mustafamamdouh78@gmail.com',
        apiToken:'vfifA5h4T1xASdoUgcV4567D'
    }
    public successMessages = { postTicketSuccess: 'Ticked Added' }
}