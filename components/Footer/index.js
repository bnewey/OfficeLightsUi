import React from "react";
import { makeStyles } from '@material-ui/core/styles';


const StyledFooter = (props) => {
  const useStyles = makeStyles(theme => ({
    root: {
      padding: '15px',
      background: '#5c8fc7',
      color: '#f5f5f5',
    },
  }));

  const classes = useStyles();

  return(<div className={classes.root}>Rainey Electronics - Lights Control</div>);

}

export default StyledFooter