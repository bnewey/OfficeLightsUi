import React from 'react';
import socketIOClient from 'socket.io-client';

import getConfig from 'next/config';
import cogoToast from 'cogo-toast';
const {publicRuntimeConfig} = getConfig();
const {ENDPOINT_PORT} = publicRuntimeConfig;

//************************************************ */
// High Order Component that wraps around a page component 
//to recieve rows/socket/endpoint AKA connectivity to c++ and nodejs
//************************************************ */


// COMPONENT NOT IN USE !!!!!!!!!!!!!!!!!!!!!!!!!!!!//
//
//
/////

function WithData(BaseComponent) {
  class App extends React.Component {
    _isMounted = false;

    constructor(props){
      super(props);

      var endpoint = "10.0.0.109:" + ENDPOINT_PORT;

      this.state = {
        data_lights: null,
        data_switch: null,
        endpoint: endpoint,
        socket: socketIOClient(endpoint),
      };      
    }

    componentDidMount() {
        //_isMounted checks if the component is mounted before calling api to prevent memory leak
      this._isMounted = true;
      const { endpoint,socket } = this.state;

      socket.on("FromC", async data => {
          if(this._isMounted) {
            try{
              var json = await JSON.parse(data);
              this.setState({ data_lights: json.lightsData, data_switch: json.switchData });
            }
            catch(error){
              console.log(error);
            }
          }
      }); 
    }

    // shouldComponentUpdate(nextProps) {
    //   const differentLights = this.props.data_lights !== nextProps.data_lights;
    //   const differentSwitch = this.props.data_switch !== nextProps.data_switch;
    //   return differentLights || differentSwitch;
    // }

    componentWillUnmount(){
        this._isMounted = false;
        const {socket} = this.state;
        socket.disconnect();
    }

    render() {
      return <BaseComponent {...this.state} />;
    }
  }

  return App;
}

export default WithData;