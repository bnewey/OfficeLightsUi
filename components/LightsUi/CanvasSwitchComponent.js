import React, {useEffect, useState} from 'react';

import Router, {useRouter} from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import {Paper,  ButtonGroup, Button} from '@material-ui/core';


import Grid from '@material-ui/core/Grid';
import { mergeClasses } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';

import { textAlign } from '@material-ui/system';
import Switch from '../../js/Switch';

import cogoToast from 'cogo-toast';


const CanvasSwitchComponent = (props) => {
    
    const {name, description, type, array_index, id, lights,data_switch, handleToggleLight, x1,x2,y1,y2} = props;
    
    const [pendingChange, setPendingChange] = useState(false);
    const [pendingChangeValue, setPendingChangeValue] = useState(null);

    useEffect(()=>{
        if(pendingChange && pendingChangeValue != null){
            if(!(lights[0].value == pendingChangeValue)){
                console.log("Pending Change case completed");
                setPendingChange(false);
                setPendingChangeValue(null);
            }
            else{
                console.log("Pending change still going on", lights[0].value)
            }
        }
    },[lights])

    //only works inside a functional component
    const classes = useStyles({...props, pendingChange});


    const handleToggleCSC = (event, id, fn) =>{
        fn(event,id);
        setPendingChange(true);
        setPendingChangeValue(lights[0].value);
        console.log("Setting pending change", lights[0].value);
    }

    
    

    return (
        <>
        <Tooltip title={name + ' - ' + description} classes={{tooltip: classes.toolTip}}>
        <div className={classes.switchComponent} onClick={event=> handleToggleCSC(event, id,handleToggleLight)}>
                <div className={classes.componentElements}>
                {/*SWITCH*/}
                {/* <span className={classes.light_label_off}>Switch: {name}</span>
                <Button size="small" className={classes.toggle_button} onClick={event=> handleToggleLight(event, id)}>Toggle</Button> */}
                {/* LIGHTS */}
                {/* { lights && lights.length > 0 ?
                    
                    <>
                    {   //Return 'light div' for each light
                        lights.map((light, i)=>(<>
                            <span className={light.value == 0 ? classes.light_label_off : classes.light_label_on}>Light {i+1}</span>
                            </>
                        ))
                    }  
                        
                    </>
                    :
                    <><span>No Lights</span></>
                } */}
                {/* TIMERS*/} 
                <div className={classes.linearProgress}>
                    {data_switch && (data_switch.move_timer > 0 || data_switch.toggle_timer > 0) ? 
                        <>  
                      <LinearProgress variant="determinate" value={data_switch.toggle_timer ? ((data_switch.toggle_timer/900)*100) : ((data_switch.move_timer/900)*100)} />
                        </>
                    : <></>}
                </div>
                {
                    data_switch 
                    ?  <>
                        {data_switch.toggle_timer > 0 ? <span className={classes.toggleSpan}>(Toggled)</span> : <></>}
                        </>
                    : <></>
                }

                
                <div className={classes.CircularProgressContainer}>{pendingChange ? <CircularProgress size={15} className={classes.CircularProgress}/>
                :<></>
                }</div>

                {/* Motion Sensor */}
                { data_switch && data_switch.switch_value == 1 ? 
                  <> <div className={classes.motion_icon_div}></div></>
                  : <></>
                }

                
                </div>
        </div>
        </Tooltip>
        </>
    )
}



export default CanvasSwitchComponent;

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    margin: '1% 0%',
    padding: '2% 3% 4% 3%',
    backgroundColor: '#ffffff',
    boxShadow: '-11px 12px 6px -5px rgba(0,0,0,0.2), 0px 0px 1px 0px rgba(0,0,0,0.14), 0px 0px 1px -1px rgba(0,0,0,0.12)',
  },
  toolTip:{

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
      height: '6px',
    },
    '& .MuiLinearProgress-colorPrimary':{
        backgroundColor: '#3d5e68',
    },
    '& .MuiLinearProgress-barColorPrimary':{
        backgroundColor: '#75ea1c',
    },
    display:'flex',
    flexDirection:'column',
    margin:'0px 1%',
    width: '100%',
    maxWidth:'40px',
    border: props=> (props.data_switch && (props.data_switch.move_timer > 0 || props.data_switch.toggle_timer > 0))  ? '1px solid #3d5e68' : '',
    '& > * + *': {
      
    },
  },
  motion_icon_div:{
    alignSelf:'flex-end',
    backgroundImage: 'url(/static/motion_green.png)',
    backgroundRepeat:'no-repeat',
    height: '18px',
    width: '18px',
    position: 'relative',
    backgroundPosition: 'center',
    backgroundSize: 'contain' ,
    margin: '0 1%',
    textAlign: 'center',
    backgroundColor: '#3d5e68',
    borderRadius: '5px',
    margin: '1%',
  },

  switchComponent:{
    position: 'absolute',
    cursor: 'pointer',
    background: props=> { console.log(props.pendingChange); return(props.lights && props.lights.length > 0 && props.lights[0].value == 1) 
            ? ( props.pendingChange ? 'linear-gradient(45deg, #b3b3b3, #096f9aa6)' : 'linear-gradient(45deg, #008f8f94, #ddf5ffa6)' )
            : ( props.pendingChange ? 'linear-gradient(45deg, #b3b3b3, #096f9aa6)' : '#8e8e8eab' )},
    height: props => `${props.y2 - props.y1}%`,
    width: props => `${props.x2 - props.x1}%`,
    top: props => `${props.y1}%`,
    left: props => `${props.x1}%`,
    '&:hover':{
        border: '2px solid #f38310c7'
    }
  },
  CircularProgressContainer:{
    display: 'flex',
    justifyContent: 'center',
    minWidth: '15px',
    minHeight: '15px',
  },
  CircularProgress:{
    margin: '2%',
  },
  componentElements:{
      height: '100%',
      display:'flex',
      justifyContent:' space-between',
      alignItems:'center',
      flexDirection: props=> ((props.x2 - props.x1) > (props.y2 - props.y1)) ? 'row' : 'column',
  },
  toggleSpan:{
      fontSize: '8px',
  }


}));