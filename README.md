##An API that allows you to track all of your team events!
This application will receive and store incoming messages from external services. It tries to centralize events from several tools in one place, aiming to simplify the team management and awareness.


##Routes

####GET /api/repos/:user/:repo
- Returns all events for that specific repository.

####GET /api/repos/:user/:repo/:event_name
- Returns the given event type for that specific repository.
- Available event types: 'issues', 'push' (more events will be added soon).

####GET /api/gitnotifications
- Returns all notifications from the database (Will be deprecated soon).

####POST /api/git-hook
- Triggers the creation of a Github webhook to receive all events form the given repository.

#####Parameters
| __Name__      | __Type__      | __Description__  
| ------------- |:-------------:| -----:|
| path      | string | Repository's path on github, e.g., ':user/:repo'.
| token     | string | Oauth token with webhook __read__ rights to __repos__ and __orgs__.

