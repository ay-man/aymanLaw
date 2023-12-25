
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  
  spacer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    width: '100%'
  },
  
}));

export default function Spacer() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.spacer} />
  );
}