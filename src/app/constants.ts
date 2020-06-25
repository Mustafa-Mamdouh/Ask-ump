export class Constants {
    jiraBaseUrl = '/rest/api/'
    public urls = {
        getAllMetadata:this.jiraBaseUrl + '2/issue/createmeta',
        postTicketUrl: this.jiraBaseUrl + '2/issue'
    }
    public authenticationParameters={
        email:'mustafamamdouh78@gmail.com',
        apiToken:'vfifA5h4T1xASdoUgcV4567D'
    }
    public successMessages = { postTicketSuccess: 'Ticked Added' }
}