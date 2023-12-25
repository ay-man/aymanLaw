import React, { useState, useEffect  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function VoteSearchBar(props) {
  
  const [currMemberID, setCurrMemberID] = React.useState("");
  const [currMemberName, setCurrMemberName] = React.useState("");
  const [voteMessage, setVoteMessage] = React.useState("");
  const [members, setMembers] = React.useState(null);

  const handleCurrMemberID = (event, value) => {
    var newMember = value === null ? "" : value.id;
    setCurrMemberID(newMember);

    var newMemberName = value === null ? "" : value.name;
    setCurrMemberName(newMemberName);
  };

  const handleVoteMessage = () => {
    var url = require('./../data/key.json');
    url = url['url']+ '/getMemberRecentVotes?id='+ currMemberID;
    fetch(url)
    .then(async (response) => {
      const data = await response.json();
      setVoteMessage(getMemberVoteResult(data));
    });
  };

  const clearVoteMessage = () => {
    setVoteMessage("");
  };

  useEffect(() => {
    setMembers(props?.members)
  },[props?.members]);

  function getMemberVoteResult(memberObject) {
    if(currMemberID === ""){
      return "Please select a " + props.type + " to see how they voted.";
    }
    var memberVotes = memberObject["results"][0]["votes"];
    for(let vote of memberVotes){
      if(props.source === vote.vote_uri){
        return currMemberName + " voted: " + vote.position;
      }
    }
    return "Not Found"
  }
  
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" align='center'> Use the search bar below to see how a specific {props.type} voted.</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {members !== undefined ? 
            <Autocomplete
            options={props.members}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label={props.type} variant="outlined" />}
            onChange={handleCurrMemberID}
            />
            :
            <span></span>
          }
          
        </Grid>
      </Grid>
      <Grid container >
      <Grid item xs={1}>
        </Grid>
        <Grid item xs={5}>
          <Button variant="contained" color="primary" fullWidth={true} onClick={handleVoteMessage}>
            Search
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button variant="contained" color="secondary" fullWidth={true} onClick={clearVoteMessage}>
            Clear
          </Button>
        </Grid>
        <Grid item xs={1}>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" align='center'>{voteMessage}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}