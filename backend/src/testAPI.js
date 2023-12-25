const axios = require('axios');
var keyFile = require('./key.json');
var KEY = keyFile['key'];

async function testRequest() {
  try {
    const response = await axios.get('https://api.propublica.org/congress/v1/117/house/members.json', {
      headers: { 'X-API-Key': KEY },
    });
    console.log("Data received:", response.data);
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
  }
}

testRequest();

