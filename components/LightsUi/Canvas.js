import React, {useEffect, useState,useRef} from 'react';

import Router, {useRouter} from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import {Paper,  ButtonGroup, Button} from '@material-ui/core';

import CanvasSwitchComponent from './CanvasSwitchComponent';

const Canvas = ({dbSwitchData, data_lights, data_switch ,socket,  endpoint, handleToggleLight}) => {
  const router = useRouter();


  //only works inside a functional component
  const classes = useStyles();



  return (
    <>
    { dbSwitchData ? //&& dbSwitchData.error != 1 ?
              <>
                    
                        {/* <img src="/static/buildingv2b.png" style={{width: 1600, height: 800}}/> */}
                        {/* <div><img className={classes.tmpFixed} src="/static/motion_green.png"/></div> */}
                        {dbSwitchData ? <>
                        { dbSwitchData.map((_switch, i)=> {
                                var lights = data_lights.filter((item, i)=> _switch.id == item.switch_id);

                                return( <><CanvasSwitchComponent key={_switch.array_index} type={_switch.type} array_index={_switch.array_index} id={_switch.id} name={_switch.name} description={_switch.description}
                                      lights={lights} data_switch={data_switch[_switch.array_index]} handleToggleLight={handleToggleLight} x1={_switch.x1} x2={_switch.x2} y1={_switch.y1} y2={_switch.y2} /></>);
                            }) }
                        </>
                        : <></>}
              
              </>
            : <>No Data</>
          }
    </>
  )
}



export default Canvas;

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
  tmpFixed:{
    position: 'absolute',
    height: '20px',
    width:'20px',
    top: '10px',
    left: '10px'
  }


}));