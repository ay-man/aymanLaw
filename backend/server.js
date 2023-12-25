var cron = require('node-cron');
var dataHelper = require('./src/get_data.js');
var validURLS = require('./src/key.json');

//valid timezones: https://raw.githubusercontent.com/node-cron/tz-offset/a67968ab5b0efa6dee296dac32d3205b41f158e0/generated/offsets.json
cron.schedule('0 23 0 * * *', function() {
  dataHelper.getData();
}, {
    scheduled: true,
    timezone: "America/New_York"
}
);

const express = require('express');
const app = express();
const port = 8080;

app.use(function (req, res, next) {

  var allowedDomains = [validURLS["localhost"], validURLS["production_url"] ];
  var origin = req.headers.origin;
  if(allowedDomains.indexOf(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.get('/', (req, res) => {
  res.send('Welcome to the backend of Watching the Watchmen')
});

app.get('/getSenators', (req, res) => {
  let senators = require('./src/data/current_members_senate.json');
  res.json(senators)
});

app.get('/getRepresentatives', (req, res) => {
  let representatives = require('./src/data/current_members_house.json');
  res.json(representatives)
});

app.get('/getSenateVotes', (req, res) => {
  let votesSenate = require('./src/data/recent_votes_senate.json');
  res.json(votesSenate)
});

app.get('/getHouseVotes', (req, res) => {
  let votesHouse = require('./src/data/recent_votes_house.json');
  res.json(votesHouse)
});

app.get('/getMemberRecentVotes', (req, res) => {

  let id = req.query.id;
  let representatives = require('./src/data/member_data/' + id + ".json");
  res.json(representatives)
});

// Getting all the bills
app.get('/getAllBills', (req, res) => {
  let bills = require('./src/data/bills.json');
  res.json(bills)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
