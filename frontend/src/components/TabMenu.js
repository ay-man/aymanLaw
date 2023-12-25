import React, { useState, useEffect  } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './TabMenu.css'
import Spacer from './Spacer.js'
import {generateLegislatorData, generateVotesData} from '../data/prepare_data.js'
import StackedBarChart from './StackedBarChart.js'
import PieChart from './PieChart.js'
import VoteSearchBar from './VoteSearchBar.js'
import VoteSummary from './VoteSummary.js'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
    className="boxDiv"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  selector:{
    with:'100%',
    padding :0,
  },
  selection:{
  },
  selectionText:{

  },
}));

export default function TabMenu(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [currVoteHouse, setCurrVoteHouse] = React.useState(0);
  const [currVoteSenate, setCurrVoteSenate] = React.useState(0);
  const [senators, setSenators] = React.useState(null);
  const [representatives, setRepresentatives] = React.useState(null);
  const [senateVotes, setSenateVotes] = React.useState(null);
  const [houseVotes, setHouseVotes] = React.useState(null);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCurrVoteHouse = (event, newValue) => {
    setCurrVoteHouse(event.target.value);
  };

  const handleCurrVoteSenate = (event, newValue) => {
    setCurrVoteSenate(event.target.value);
  };

  
  function createLegendHints(voteObject, index) {
    if(voteObject === null || voteObject === undefined)
    {
      return;
    }

    let vote = generateVotesData(voteObject)[index];

    return Object.keys(vote.getLegendHints()).map((key, index) => 
           key + " - " + vote.getLegendHints()[key].replace("_", " ") + 
           (index === (Object.keys(vote.getLegendHints()).length-1) ? "" : ", "
    )); 
  }

  function createPieChart(voteObject, index){
    if(voteObject === null || voteObject === undefined)
    {
      return;
    }

    let vote = generateVotesData(voteObject)[index];

    return (
      <PieChart data={vote} />
    );
  }

  function createStackedBarChart(voteObject, index){
    if(voteObject === null || voteObject === undefined)
    {
      return;
    }

    let vote = generateVotesData(voteObject)[index];

    return (
      <StackedBarChart data={vote} />
    );
  }

  function createVoteSummary(voteObject, index){
    if(voteObject === null || voteObject === undefined)
    {
      return;
    }

    let vote = generateVotesData(voteObject)[index].getSummaryData();

    return (
      <VoteSummary data={vote} />
    );
  }

  function createVoteSearchBar(voteObject, membersObject, index, memberType){
    if((voteObject === null || voteObject === undefined) 
        || (membersObject === null || membersObject === undefined)){
      return;
    }

    let votes = voteObject["results"]["votes"]
    let members = generateLegislatorData(membersObject);
    let url = generateVotesData(voteObject)[index].getSourceURL();

    return (
      <VoteSearchBar members={members} type={memberType} chamberVotes={votes} source={url}/>
    );
  }

  function createMenuItems(voteObject){
    if(voteObject === null || voteObject === undefined)
    {
      return;
    }

    let votes = generateVotesData(voteObject);

    return (
      votes.map((obj, index) =>
        <MenuItem className={classes.selection} value={index} key={index}>
          {votes[index].getSelectBarText()}
        </MenuItem>
       )
    );
  }

  useEffect(() => {
    setSenators(props.data["membersSenate"]);
    setRepresentatives(props.data["membersHouse"]);
    setSenateVotes(props.data["votesSenate"]);
    setHouseVotes(props.data["votesHouse"]);
  },[props?.data]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="House" {...a11yProps(0)} />
          <Tab label="Senate" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <Spacer />
      <TabPanel value={value} index={0}>
      <Grid 
        container
        direction="row"
        alignItems="center"
      >
        <InputLabel>Vote ID: </InputLabel>
        <Select
            labelId="demo-simple-select"
            className={classes.selector}
            onChange={handleCurrVoteHouse}
            value={currVoteHouse}
        >

          {createMenuItems(props.data["votesHouse"])}
        </Select>
      </Grid>
      <Spacer />
      <div className="wrap">
        <div className="one">
          {createVoteSummary(props.data["votesHouse"], currVoteHouse)}
        </div>
        <div className="three"></div>
        <div className="two">
        <Typography variant="h5" align="center">
            Vote count
        </Typography>
        <Typography variant="body1" align="center">
          { createLegendHints(props.data["votesHouse"], currVoteHouse) }
        </Typography>
          { createPieChart(props.data["votesHouse"], currVoteHouse) }
        </div>
      </div>
      <Spacer />
      <div className="wrap">
        <div className="one">
          {createVoteSearchBar(props.data["votesHouse"], props.data["membersHouse"], currVoteHouse, "Representative")}
        </div>
        <div className="three"></div>
        <div className="two">
          <Typography variant="h5" align="center">
            Vote breakdown by party
          </Typography>
          <Typography variant="body1" align="center">
            { createLegendHints(props.data["votesHouse"], currVoteHouse) }
          </Typography>
          { createStackedBarChart(props.data["votesHouse"], currVoteHouse) }
        </div>
      </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid 
          container
          direction="row"
          alignItems="center"
        >
          <InputLabel>Vote ID: </InputLabel>
          <Select
              labelId="demo-simple-select-label"
              className={classes.selector}
              label="Hello"
              onChange={handleCurrVoteSenate}
              value={currVoteSenate}
          >
            {createMenuItems(props.data["votesSenate"])}
          </Select>
        </Grid>
        <Spacer />
        <div className="wrap">
          <div className="one">
            {createVoteSummary(props.data["votesSenate"], currVoteSenate)}
          </div>
          <div className="three"></div>
          <div className="two">
          <Typography variant="h5" align="center">
            Vote count
          </Typography>
          <Typography variant="body1" align="center">
            { createLegendHints(props.data["votesSenate"], currVoteSenate) }
          </Typography>
          { createPieChart(props.data["votesSenate"], currVoteSenate) }
          </div>
        </div>
        <Spacer />
        <div className="wrap">
          <div className="one">
            {createVoteSearchBar(props.data["votesSenate"], props.data["membersSenate"], currVoteSenate, "Senator")}
          </div>
          <div className="three"></div>
          <div className="two">
            <Typography variant="h5" align="center">
              Vote breakdown by party
            </Typography>
            <Typography variant="body1" align="center">
              { createLegendHints(props.data["votesSenate"], currVoteSenate) }
            </Typography>
            { createStackedBarChart(props.data["votesSenate"], currVoteSenate) }
          </div>
        </div>
      </TabPanel>
      <Spacer />
      <Spacer />
    </div>
  );
}
