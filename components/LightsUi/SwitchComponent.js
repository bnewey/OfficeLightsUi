import React, {useEffect, useState} from 'react';

import Router, {useRouter} from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import {Paper,  ButtonGroup, Button} from '@material-ui/core';


import Grid from '@material-ui/core/Grid';
import { mergeClasses } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';


import { textAlign } from '@material-ui/system';
import Switch from '../../js/Switch';

import cogoToast from 'cogo-toast';


const SwitchComponent = (props) => {
    
    const {name, description, type, array_index, id, lights,data_switch, handleToggleLight} = props;
    

    //only works inside a functional component
    const classes = useStyles();


    return (
        <div className={classes.light_div}>
                {/*SWITCH*/}
                <span className={classes.light_label_off}>Switch: {name}</span>
                <Button size="small" className={classes.toggle_button} onClick={event=> handleToggleLight(event, id)}>Toggle</Button>
                {/* LIGHTS */}
                { lights && lights.length > 0 ?
                    
                    <>
                    {   //Return 'light div' for each light
                        lights.map((light, i)=>(<>
                            <span key={'light'+i+1} className={light.value == 0 ? classes.light_label_off : classes.light_label_on}>Light {i+1}</span>
                            </>
                        ))
                    }  
                        
                    </>
                    :
                    <><span>No Lights</span></>
                }
                {/* TIMERS*/}
                {data_switch && data_switch.move_timer > 0 ? 
                  <>  
                    <div className={classes.linearProgress}>
                      <span>Motion:</span>
                      <LinearProgress variant="determinate" value={(data_switch.move_timer/900)*100} />
                      </div>
                  </>
                : <></>}
                {data_switch && data_switch.toggle_timer > 0 ? 
                  <>  
                    <div className={classes.linearProgress}>
                    <span>Toggle:</span>
                      <LinearProgress variant="determinate" value={(data_switch.toggle_timer/900)*100} />
                      </div>
                  </>
                : <></>}

                {/* Motion Sensor */}
                { data_switch && data_switch.switch_value == 1 ? 
                  <> <div className={classes.motion_icon_div}></div></>
                  : <></>
                }
        </div>
    )
}



export default SwitchComponent;

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    margin: '1% 0%',
    padding: '2% 3% 4% 3%',
    backgroundColor: '#ffffff',
    boxShadow: '-11px 12px 6px -5px rgba(0,0,0,0.2), 0px 0px 1px 0px rgba(0,0,0,0.14), 0px 0px 1px -1px rgba(0,0,0,0.12)',
  },
  container:{
    alignItems: 'center',
    background: 'linear-gradient( #ecebeb, #9e9e9e)',
    borderRadius: '10px',
    border: '1px solid #ababab',
    minHeight: '80px',
  },
  light_label_off:{
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    backgroundColor: '#d1d1d1',
    flexBasis: '15%',
    padding: '7px',
    borderRadius: '3px',
    textAlign: 'center',
  },
  light_label_on:{
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    backgroundColor: '#46ccff',
    color: '#fff',
    flexBasis: '15%',
    padding: '7px',
    borderRadius: '3px',
    textAlign: 'center',
  },
  light_div:{
    margin: '1px 2%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  light_container:{
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ecececec',
    margin: '1%',
    padding: '1%',
  },
  toggle_button:{
    flexBasis: '8%',
    color: '#fff',
    background: 'linear-gradient( #d4732f, #ffa500)',
    boxShadow: '-1px 1px 4px 0px #5f371b',
    margin: '0px 5px',
  },
  linearProgress: {
    '& .MuiLinearProgress-root':{
      height: '10px',
    },
    display:'flex',
    flexDirection:'column',
    margin:'0px 1%',
    width: '5%',
    '& > * + *': {
      
    },
  },
  motion_icon_div:{
    backgroundImage: 'url(/static/motion_green.png)',
    backgroundRepeat:'no-repeat',
    height: '20px',
    width: '20px',
    position: 'relative',
    backgroundPosition: 'center',
    backgroundSize: 'contain' ,
    margin: '0 1%',
    textAlign: 'center',
  }


}));