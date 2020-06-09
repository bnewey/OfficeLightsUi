import React, {useEffect, useState,useRef} from 'react';

import Router, {useRouter} from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import {Paper,  ButtonGroup, Button} from '@material-ui/core';


import Grid from '@material-ui/core/Grid';
import { mergeClasses } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import socketIOClient from 'socket.io-client';
import { Z_BLOCK } from 'zlib';

import { textAlign } from '@material-ui/system';
import Switch from '../../js/Switch';
import Light from '../../js/Light';

import cogoToast from 'cogo-toast';
import SwitchComponent from './SwitchComponent';
import SettingsModal from '../Settings/SettingsModal';
import Canvas from './Canvas';


const UiTableWithStyles = ({data_lights, data_switch ,socket,  endpoint}) => {
  const router = useRouter();

  const [dbSwitchData, setDbSwitchData] = useState(null);
  const [dbLightData, setDbLightData] = useState(null);
  const [shouldResetData, setShouldResetData] = useState(false);

  //only works inside a functional component
  const classes = useStyles();


  useEffect(()=>{
    if(dbSwitchData ==null){
      Switch.getVariables()
        .then( data => { 
          setDbSwitchData(data);
        })
        .catch( error => {
            console.warn(error);
            cogoToast.error(`Error getting switch data from DB`, {hideAfter: 4});
        });

    }
    
  },[dbSwitchData]);

  useEffect(()=>{
    if(dbLightData ==null){
      Light.getVariables()
        .then( data => { 
          setDbLightData(data);
        })
        .catch( error => {
            console.warn(error);
            cogoToast.error(`Error getting light data from DB`, {hideAfter: 4});
        });

    }
    
  },[dbLightData]);

  useEffect(()=> {
    if(shouldResetData == true){
      setDbLightData(null);
      setDbSwitchData(null);
      setShouldResetData(false);
    }
  },[shouldResetData])


//   const handleStartClick = (event) =>{
//       socket.emit('Turn On All Machines', "all_machines");
//       setStartBool(true);
//       cogoToast.success("Starting...", {hideAfter: 4});
//   }
  

//   const handleStopClick = (event) =>{
//       socket.emit('Turn Off All Machines', "all_machines");
//       setStartBool(false);
//       cogoToast.success("Stopping...", {hideAfter: 4});
//   }
  
const handleToggleLight = (event, name) => {
  if(!name){
    return;

  }
  socket.emit('ToggleLight', name);
  cogoToast.success(`Toggling ${name}`);
}

  return (
    <Paper classes={{root:classes.root}} className={classes.root}>
      <SettingsModal endpoint={endpoint} socket={socket} setShouldResetData={setShouldResetData}/>
      
      <Grid container  spacing={2} justify="center" className={classes.container}>
      </Grid>
      <Grid container  spacing={2} justify="center" className={classes.floorplan_container}>
          <Canvas dbSwitchData={dbSwitchData} data_lights={data_lights} data_switch={data_switch} socket={socket}  endpoint={endpoint} handleToggleLight={handleToggleLight}/>
      </Grid>

      <Grid container  spacing={2} justify="center" className={classes.light_container}>
          { dbSwitchData ? //&& dbSwitchData.error != 1 ?
              <>
              { dbSwitchData.map((_switch, i)=>{
                  //Return a component for each switch
                  var lights = data_lights.filter((item, i)=> _switch.id == item.switch_id);

                  return(<SwitchComponent type={_switch.type} array_index={_switch.array_index} id={_switch.id} name={_switch.name} description={_switch.description}
                                      lights={lights} data_switch={data_switch[_switch.array_index]} handleToggleLight={handleToggleLight}/>);
                  
                }
              )}
              
              </>
            : <>No Data</>
          }

          {/* { data_lights.length > 0 && data_switch.length > 0 ? //&& data_lights.error != 1 ?
              <>
              { data_lights.map((light, i)=>(
                <div className={classes.light_div}>
                <span className={light.value == 1 ? classes.light_label_on :classes.light_label_off}>Light {`${i+1}`}</span>
                <Button size="small" className={classes.toggle_button} onClick={event=> handleToggleLight(event, light.array_index)}>Toggle</Button>
              </div>
              ))}
              
              </>
            : <>No Data</>
          } */}
          </Grid>     


    </Paper>

    
  )
}


const LightsUi = ({data_lights, data_switch, endpoint, socket}) => {
  
    return (
      <div>{data_lights && data_switch  ?  
        <div><UiTableWithStyles data_lights={data_lights} data_switch={data_switch} socket={socket} endpoint={endpoint}/></div> 
        : <div ><CircularProgress style={{marginLeft: "47%"}}/></div>
      } </div>
    );
}

export default LightsUi;

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
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    margin: '1%',
    padding: '1%',
    boxShadow: 'inset 0px 0px 8px 2px rgba(67, 67, 67, 0.2)',
  },
  floorplan_container:{
    backgroundImage: 'url(/static/buildingv2b.png)',
    backgroundRepeat:'no-repeat',
    height: '800px',
    width: '1600px',
    position: 'relative',
    backgroundPosition: 'center',
    backgroundSize: 'contain' ,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff3da91',
    margin: '25px 6px',
    padding: '1%',
    boxShadow: 'inset 0px 0px 8px 2px rgba(67, 67, 67, 0.2)',
  },
  toggle_button:{
    flexBasis: '8%',
    color: '#fff',
    background: 'linear-gradient( #d4732f, #ffa500)',
    boxShadow: '-1px 1px 4px 0px #5f371b',
    margin: '0px 5px',
  },


}));