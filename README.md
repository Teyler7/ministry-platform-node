# Ministry Platform

[![Teamcity Status](<https://ci.crossroads.net/app/rest/builds/buildType:(id:SharedCode_Release_MinistryPlatformNode)/statusIcon.svg>)](https://ci.crossroads.net/viewType.html?buildTypeId=SharedCode_Release_MinistryPlatformNode)

an npm package for interacting with the Ministry Platform Rest API

## Usage

#### Prerequisites

This package uses async/await, so requires a node version > 7.6
 
#### Build a request

currently, only GET requests with select columns, filters, and table in implemented.

```js
const MP = require('ministry-platform');
const mp = new MP();
   
const selectColumns = []
selectColumns.push('User_ID_Table_Contact_ID_Table.[Contact_ID]')
selectColumns.push('Role_ID_Table.[Role_Name]')
selectColumns.push('dp_User_Roles.[User_Role_ID]')
const filter = `User_ID_Table_Contact_ID_Table.[Contact_ID] = 7680320 and Role_ID_Table.[Role_Name] LIKE 'pushpay'` 
const table = 'dp_User_Roles'
const data = await mp.withSelectColumns(selectColumns)
    .withFilter(filter)
    .fromTable(table)
    .get()
console.info("data:", data);
```
> to run the above example, you can run `node example.js`, just remember to set your environment variables.

## Development

#### Install dependencies

```
npm i
```

#### Run tests

```bash
npm test
# or, to run tests as you change files
npm test:watch
```

#### Environment Variables needed

* MP_REST_API_ENDPOINT = "https://adminint.crossroads.net/ministryplatformapi"
* MP_OAUTH_BASE_URL = "https://adminint.crossroads.net/ministryplatformapi/oauth"
* MP_USERNAME = "mpuser"
* MP_PASSWORD = "password1$3"
* MP_CLIENT_ID = "client-id"
* MP_CLIENT_SECRET = "mysecret"