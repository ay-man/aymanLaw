export class VoteData {
  constructor(voteObject) {
      this.voteObject = voteObject;
  }

  getPartyKeys() {
    return ["independent", "republican", "democratic"];
  }

  getFriendlyPartyKeys(){
    var keys = this.getPartyKeys();
    for(var i = 0; i <keys.length; i++){
      keys[i] = keys[i].toUpperCase();
    }
    return keys;
  }

  getVoteTypeKeys() {
    return Object.keys(this.voteObject["total"]);
  }

  hasKeyAlready(obj, key) {
    return obj[key] === undefined ? false : true;
  }

  transformToAbbreviatedKey(key){
    var wordsSeparetedByUnderscore = key.split("_");
    var wordsSeparetedBySpace = key.split(" ");
    var newKey = "";

    if(wordsSeparetedByUnderscore.length === 2 ){
      newKey += (wordsSeparetedByUnderscore[0][0] + wordsSeparetedByUnderscore[1][0]);
    }

    else if(wordsSeparetedBySpace.length === 2 ){
      newKey += (wordsSeparetedBySpace[0][0] + wordsSeparetedBySpace[1][0]);
    }

    else {
      newKey += key[0][0];
    }
    return newKey.toUpperCase();
  }

  getBarData() {
    var chartData = new Array();
    var existingVoteKeys = new Object();

    for(let key of this.getVoteTypeKeys()){
      var dataElement = new Object();
      var voteKeyForNewElement = this.transformToAbbreviatedKey(key);
      var hasKey = voteKeyForNewElement in existingVoteKeys;
      if(hasKey){
        voteKeyForNewElement+= key[1].toUpperCase();
      }
      dataElement["vote"] = voteKeyForNewElement;
      existingVoteKeys[voteKeyForNewElement] = 1;
      for(let party of this.getPartyKeys()){
        var numVotes = this.voteObject[party][key];  
        
        dataElement[party.toUpperCase()] = numVotes === undefined ? 0 : numVotes;
      }
      chartData.push(dataElement);
    }
    return chartData;
  }

  getPieData() {
    var chartData = new Array();
    var existingVoteKeys = new Object();

    for(let key of  this.getVoteTypeKeys()){
      var dataElement = new Object();
      var newKey = this.transformToAbbreviatedKey(key);
      var hasKey = newKey in existingVoteKeys;
      if(hasKey){
        newKey += key[1].toUpperCase();
      }
      dataElement["id"] = newKey;
      dataElement["label"] =  dataElement["id"];
      existingVoteKeys[newKey] = 1;
      
      var totalVotes = this.voteObject["total"];
      
      dataElement["value"] = totalVotes[key]

      chartData.push(dataElement);
    }
    return chartData;
  }

  getLegendHints() {
    var keys = this.getVoteTypeKeys();

    var mapLegendHints = new Object();

    for(var i = 0; i < keys.length ; i++ ){
      var newKey = this.transformToAbbreviatedKey(keys[i]);
      var hasKey = newKey in mapLegendHints;
      if(hasKey){
        newKey += keys[i][1].toUpperCase();
      }
      mapLegendHints[newKey] = keys[i];
    }

    return mapLegendHints;
  }
  
  getSourceURL() {
    return this.voteObject.vote_uri;
  }

  getSelectBarText() {
    var id ="";
    if(this.voteObject["bill"] !== undefined && Object.keys(this.voteObject["bill"]).length !== 0 ){
      if(this.voteObject["bill"]["bill_id"] !== undefined){
        id = this.voteObject["bill"]["bill_id"] + ", ";
      }
    }
    else if(this.voteObject["nomination"] !== undefined){
      if(this.voteObject["nomination"]["nomination_id"] !== undefined){
        id = this.voteObject["nomination"]["nomination_id"] + ", ";
      }
    }

    id += this.voteObject["date"] + " " + this.voteObject["time"];
    return id;
  }

  getSummaryData() {
    
    let summary = {
      "bill_id": this.voteObject["bill"]["bill_id"],
      "nomination_id":  "nomination" in this.voteObject ? this.voteObject["nomination"]["nomination_id" ]: '',
      "date": this.voteObject["date"],
      "time": this.voteObject["time"],
      "description": this.voteObject["description"],
      "question": this.voteObject["question"],
      "question_text": this.voteObject["question_text"],
      "latest_action": this.voteObject["bill"]["latest_action"],
      "vote_type": this.voteObject["vote_type"],
      "result": this.voteObject["result"],
      "source": this.voteObject["source"]
    };
    return summary;
  }
  
}

export class MemberData {
  constructor(memberObject) {
      this.memberObject = memberObject;
  }

  getMemberData() {

    var member= new Object();
    var middleName = this.memberObject.middle_name === null ? " " : (" " + this.memberObject.middle_name + " ");
    member["name"] = this.memberObject.first_name +  middleName +  this.memberObject.last_name;
    member["id"] = this.memberObject.id;
    member["title"] = this.memberObject.title;
    member["date_of_birth"] = this.memberObject.date_of_birth;
    member["gender"] = this.memberObject.gender;
    member["party"] = this.memberObject.party;
    member["state"] = this.memberObject.state;
    member["district"] = this.memberObject.district;
    member["next_election"] = this.memberObject.next_election;
    member["missed_votes"] = this.memberObject.missed_votes;
    member["total_votes"] = this.memberObject.total_votes;
    member["missed_vote_pct"] = this.memberObject.missed_vote_pct;
    member["votes_with_party_pct"] = this.memberObject.votes_with_party_pct;
    member["votes_against_party_pct"] = this.memberObject.votes_against_party_pct;
    member["next_election"] = this.memberObject.next_election;
    member["office"] = this.memberObject.office;
    member["phone"] = this.memberObject.phone;
    member["twitter_account"] = this.memberObject.twitter_account;
    member["facebook_account"] = this.memberObject.facebook_account;
    member["youtube_account"] = this.memberObject.youtube_account;
    return member;
  }
  
}

function generateLegislatorData(legislatorObject){
  if(legislatorObject === null || legislatorObject === undefined)
  {
    return;
  }

  let legislators = legislatorObject["results"][0]["members"];
  let legislatorsMemberData = new Array(); 
  for(let index of legislators) {
    let legislator = new MemberData(index);
    legislatorsMemberData.push(legislator.getMemberData());
  }
  return legislatorsMemberData;
}

function generateVotesData(votesObject){
  if(votesObject === null || votesObject === undefined)
  {
    return;
  }
  
  let votes = votesObject["results"]["votes"];
  let votesData = new Array(); 
  for (let index of Object.keys(votes) ){
    let voteTemp =  new VoteData(votes[index]);
    votesData.push(voteTemp);
  }
  return votesData;
}

export {generateLegislatorData}
export {generateVotesData}
