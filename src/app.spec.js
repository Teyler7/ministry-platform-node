const MP = require('./app');
const nock = require('nock');

let mp;
beforeEach(() => {
  mp = new MP();
  const expectedBody = "username=4&password=&grant_type=password&scope=http%3A%2F%2Fwww.thinkministry.com%2Fdataplatform%2Fscopes%2Fall%20openid&client_id=CRDS.Common&client_secret=This%20secret%20really%20is%20secret%2C%20so%20don't%20store%20it%20in%20github"
  nock('https://adminint.crossroads.net')
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .post('/ministryplatformapi/oauth/connect/token', expectedBody)
    .reply(200, {data: 1});
});

test('#loadUserToken', async () => {
  await mp.loadUserToken()
})
// test('#loadClientCredentialsToken', () => {})
// test('#withSelectColumns', () => {})
// test('#withFilter', () => {})
// test('#fromTable', () => {})
// test('#get', () => {})