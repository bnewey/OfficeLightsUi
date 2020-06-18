import React, { useEffect , useState} from 'react'
import PropTypes from 'prop-types';

import MainLayout from '../components/Layouts/Main';

import LightsUi from '../components/LightsUi/LightsUi';
import ReconnectSnack from '../components/UI/ReconnectSnack';
import withAuth from '../server/lib/withAuth';

import socketIOClient from 'socket.io-client';
import getConfig from 'next/config';
const {publicRuntimeConfig} = getConfig();
const {ENDPOINT_PORT, ENDPOINT_HOST} = publicRuntimeConfig;
const endpoint =  ENDPOINT_HOST+ ":" + ENDPOINT_PORT;

const Index = (props) => {
    const [data_lights, setDataLights] = useState(null);
    const [data_switch, setDataSwitch] = useState(null);
    const [socket, setSocket] = useState(null);
    const {user} = props;

    
    useEffect(()=>{
      //Set out Socket IO to endpoint once or if null
      if(socket == null){
        setSocket(socketIOClient(endpoint));
      }
      //If socket, register event for our data. 
      //This will continue to update data even though the socket useEffect will only run this once
      if(socket != null){
        socket.on("FromC", async data => {
          try{
            var json = await JSON.parse(data);
            setDataLights(json.lightsData);
            setDataSwitch(json.switchData);
          }
          catch(error){
            console.log(error);
          }
        }); 
      }
    },[socket])


    return (
        <MainLayout>
            <ReconnectSnack data_lights={data_lights} data_switch={data_switch} socket={socket} />

            <LightsUi user={user} data_lights={data_lights} data_switch={data_switch} socket={socket} endpoint={endpoint}/>
        </MainLayout>
    );
}

export default withAuth(Index);