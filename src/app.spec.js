const MP = require('./app')
const nock = require('nock')
let mp
beforeAll(() => {
  process.env.MP_USERNAME = "mpuser"
  process.env.MP_PASSWORD = "password1$3"
  process.env.MP_CLIENT_ID = "client-id"
  process.env.MP_CLIENT_SECRET = "mysecret"
  nock.disableNetConnect()
})
beforeEach(() => mp = new MP())

describe('#loadUserToken', () => {
  let req
  beforeEach(() => {
    mp = new MP()
    const expectedBody = "username=mpuser&password=password1%243&grant_type=password" +
      "&scope=http%3A%2F%2Fwww.thinkministry.com%2Fdataplatform%2Fscopes%2Fall%20openid" +
      "&client_id=client-id&client_secret=mysecret"
    req = nock('https://adminint.crossroads.net')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .post('/ministryplatformapi/oauth/connect/token', expectedBody)
      .reply(200, {data: 1})
  })
  test('should have correct http params', async () => {
    await mp.loadUserToken()
    expect(req.isDone()).toBeTruthy()
  })
})
describe('#loadClientToken', () => {
  let req
  beforeEach(() => {
    mp = new MP()
    const expectedBody = "grant_type=client_credentials" +
      "&scope=http%3A%2F%2Fwww.thinkministry.com%2Fdataplatform%2Fscopes%2Fall" +
      "&client_id=client-id&client_secret=mysecret"
    req = nock('https://adminint.crossroads.net')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .post('/ministryplatformapi/oauth/connect/token', expectedBody)
      .reply(200, {data: 1})
  })
  test('should have correct http params', async () => {
    await mp.loadClientToken()
    expect(req.isDone()).toBeTruthy()
  })
})
test('#withSelectColumns', () => {
  mp.withSelectColumns(["Donation.[Donation_ID]", "Donation.[Donation_Date]"])
  expect(mp.selectColumns).toHaveLength(2)
  expect(mp.selectColumns[0]).toEqual("Donation.[Donation_ID]")
  expect(mp.selectColumns[1]).toEqual("Donation.[Donation_Date]")
})
test('#withFilter', () => {
  mp.withFilter("Donation.[Donation_ID] = 321")
  expect(mp.filter).toEqual("Donation.[Donation_ID] = 321")
})
test('#fromTable', () => {
  mp.fromTable("Donations")
  expect(mp.table).toEqual("Donations")
})
describe.skip('#get', () => {
  beforeEach(() => {
    // TODO figure out how to mock OPTIONS request
    var scope = nock('https://adminint.crossroads.net')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .filteringRequestBody(function(body) {
        return '*';
      })
      .options('/ministryplatformapi/tables/Donations?$select=Donation.[Donation_ID],+Donation.[Donation_Date]&$filter=Donation.[Donation_ID]+%3D+321', '*')
      .reply(200, 'OK');
  });
  beforeEach(() => {
    const expectedBody = "grant_type=client_credentials" +
      "&scope=http%3A%2F%2Fwww.thinkministry.com%2Fdataplatform%2Fscopes%2Fall" +
      "&client_id=client-id&client_secret=mysecret"
    req = nock('https://adminint.crossroads.net', {allowUnmocked: true})
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .post('/ministryplatformapi/oauth/connect/token', expectedBody)
      .reply(200, {data: 1})
  })
  beforeEach(() => {
    req = nock('https://adminint.crossroads.net')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/ministryplatformapi/tables/Donations')
      .reply(200, {data: 1})
  })
  test('should have correct http params', async () => {
    await mp.withSelectColumns(["Donation.[Donation_ID]", "Donation.[Donation_Date]"])
      .withFilter("Donation.[Donation_ID] = 321")
      .fromTable("Donations")
      .get()
  })
})