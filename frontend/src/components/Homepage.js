import React, { useState, useEffect, useCallback } from 'react';
import Layout from './Layout.js';
import Dashboard from './Dashboard.js';
import Introduction from './Introduction.js';
import Spacer from './Spacer.js';
import LookupLegislators from './LookupLegislators.js';

export default function Homepage() {
  const [membersSenate, setMembersSenate] = useState(null);
  const [membersHouse, setMembersHouse] = useState(null);
  const [votesSenate, setVotesSenate] = useState(null);
  const [votesHouse, setVotesHouse] = useState(null);

  // Using useCallback to memoize the function so it doesn't get recreated on every render.
  const getDataFromBackend = useCallback((requestType) => {
    // Ensure the URL is correct and log it for verification
    let url = `http://192.168.50.111:8080/${requestType}`;  // Replace with your server's URL if different
    console.log(`Attempting to fetch from: ${url}`); // Log the URL to ensure it's correct

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        var data = await response.json();
        callStateSetter(data, requestType);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []); // Dependencies can be added if necessary

  function callStateSetter(data, requestType) {
    switch (requestType) {
      case "getSenators":
        setMembersSenate(data);
        break;
      case "getRepresentatives":
        setMembersHouse(data);
        break;
      case "getSenateVotes":
        setVotesSenate(data);
        break;
      case "getHouseVotes":
        setVotesHouse(data);
        break;
      default:
        console.log(`Unhandled request type: ${requestType}`);
    }
  }

  function getDataObject() {
    return {
      membersSenate,
      membersHouse,
      votesSenate,
      votesHouse
    };
  }

  useEffect(() => {
    getDataFromBackend("getSenators");
    getDataFromBackend("getRepresentatives");
    getDataFromBackend("getSenateVotes");
    getDataFromBackend("getHouseVotes");
  }, [getDataFromBackend]);

  return (
    <Layout>
      <Spacer />
      <Introduction />
      <Spacer />
      <div id="dashboard"></div>
      <Spacer />
      <Dashboard data={getDataObject()} />
      <div id='legislators'></div>
      <Spacer />
      <LookupLegislators data={getDataObject()} />
    </Layout>
  );
}

