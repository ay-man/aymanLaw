const axios = require('axios');
const fs = require('fs');
var keyFile = require('./key.json');
var KEY = keyFile['key'];
  
var apiURLs = {
  "recent_votes_house" : "https://api.propublica.org/congress/v1/house/votes/recent.json",   
  "recent_votes_senate" : "https://api.propublica.org/congress/v1/senate/votes/recent.json", 
  "current_members_house": "https://api.propublica.org/congress/v1/117/house/members.json",
  "current_members_senate": "https://api.propublica.org/congress/v1/117/senate/members.json"
}

class ProPublicaRequest{
  async handleRequest(requestURL) {
    const data = await axios.request({
      url: requestURL,
      headers: { 'X-API-Key': KEY },
      method: 'get'
    });
    return data
  }
}

module.exports = {
  getData(){
  
    for(let keyName of Object.keys(apiURLs)){
      
      let rqst = new ProPublicaRequest();
      rqst.handleRequest(apiURLs[keyName]).then(response => {
        const file = JSON.stringify(response.data);
        fs.writeFile( './src/data/' + keyName + '.json', file, (err) => {
          if (err) {
              throw err;
          }
        });
      }).catch(error => {
          console.log(error);
      });

    }

    let idKey = "id";
    let urlFirstPart = "https://api.propublica.org/congress/v1/members/";
    let urlSecondPart = "/votes.json";

    let senateMembers = require('./data/current_members_senate.json');
    senateMembers = senateMembers["results"][0]["members"];

    let houseMembers = require('./data/current_members_house.json');
    houseMembers = houseMembers["results"][0]["members"];

    let allMembers = senateMembers.concat(houseMembers);
    let requests = [];

    for(var i = 0; i < allMembers.length; i++){
      requests.push(axios.get(urlFirstPart + allMembers[i][idKey] + urlSecondPart,{
        headers: { 'X-API-Key': KEY },
      }));
    }

    axios.all(requests)
    .then(axios.spread((...args) => {
        for (let i = 0; i < args.length; i++) {
          fs.writeFile( './src/data/member_data/' + allMembers[i][idKey] + '.json', JSON.stringify(args[i].data), (err) => {
            if (err) {
              throw err;
              console.log("Error reading data");
            }
          })
        }
    }))
  
  }
};