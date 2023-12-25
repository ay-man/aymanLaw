import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  voteWrapper: {
    border: '1px solid #3f51b5',
  },
  title: {
    textAlign: 'center',
    backgroundColor: '#3f51b5'
  },
  voteSectionTitle: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#3f51b5',
    color : '#fff',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
  },
  voteSectionContent: {
    width: '98%',
    marginLeft: '1%',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
  },
}));

export default function VoteSummary(props) {
  
  function getFormattedObject() {

    var newObject = new Object();
    for(let key of Object.keys(props.data)){
      
      if (typeof props.data[key] === 'string'){
        if(props.data[key].length === 0 ){
          continue;
        }
      }

      if(props.data[key] === null){
        continue;
      }

      if(props.data[key] === undefined){
        continue;
      }
      
      newObject[key.replace(/_/g, " ").toUpperCase()] = props.data[key];
    }
    return newObject;
  }

  function getRows(){
    var items = new Array();
    let summary = getFormattedObject();

    for(var key in summary){
      items.push(key);
      items.push(summary[key]);
    }
    return items;
  }
  
  const classes = useStyles();

  return (
    <div className={classes.voteWrapper}>
      

        {getRows().map((row, index) => (
            <div key={index} className={index % 2 === 0 ? classes.voteSectionTitle : classes.voteSectionContent}>
              { row }
            </div>
        ))
        }
      
    </div>
  );
}