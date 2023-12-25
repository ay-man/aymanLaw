const axios = require('axios');
const fs = require('fs');
const keyFile = require('./key.json');  // Ensure this path is correct
const KEY = keyFile['key'];

console.log("Script started");

async function fetchData(url) {
  try {
    console.log(`Fetching data from: ${url}`);
    const response = await axios.get(url, { headers: { 'X-API-Key': KEY } });
    console.log(`Data fetched successfully from: ${url}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error.message);
    throw error;  // Re-throw the error to handle it in the calling function
  }
}

async function saveData(data, filename) {
  try {
    console.log(`Saving data to: ${filename}`);
    fs.writeFileSync(filename, JSON.stringify(data));
    console.log(`Data saved successfully to: ${filename}`);
  } catch (error) {
    console.error(`Failed to save data to ${filename}:`, error.message);
    throw error;  // Re-throw the error to handle it in the calling function
  }
}

async function fetchAndSaveMemberLists() {
  try {
    const houseMembersData = await fetchData('https://api.propublica.org/congress/v1/117/house/members.json');
    await saveData(houseMembersData, './data/current_members_house.json');

    const senateMembersData = await fetchData('https://api.propublica.org/congress/v1/117/senate/members.json');
    await saveData(senateMembersData, './data/current_members_senate.json');
  } catch (error) {
    console.error('Error fetching and saving member lists:', error.message);
  }
}

async function fetchAndSaveVotes() {
  try {
    const recentVotesHouseData = await fetchData('https://api.propublica.org/congress/v1/house/votes/recent.json');
    await saveData(recentVotesHouseData, './data/recent_votes_house.json');

    const recentVotesSenateData = await fetchData('https://api.propublica.org/congress/v1/senate/votes/recent.json');
    await saveData(recentVotesSenateData, './data/recent_votes_senate.json');
  } catch (error) {
    console.error('Error fetching and saving votes:', error.message);
  }
}

async function processMembers() {
  try {
    const houseMembers = require('./data/current_members_house.json')["results"][0]["members"];
    const senateMembers = require('./data/current_members_senate.json')["results"][0]["members"];

    let allMembers = houseMembers.concat(senateMembers);

    for (const member of allMembers) {
      const memberData = await fetchData(`https://api.propublica.org/congress/v1/members/${member.id}/votes.json`);
      await saveData(memberData, `./data/member_data/${member.id}.json`);
    }
  } catch (error) {
    console.error('Error processing individual members:', error.message);
  }
}

async function main() {
  await fetchAndSaveMemberLists();
  await fetchAndSaveVotes();
  await processMembers();  // Add this after confirming the previous steps work
}

main().catch(error => console.error('Failed to complete data fetching:', error.message));

