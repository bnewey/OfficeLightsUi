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
function WithData(BaseComponent) {
  class App extends React.Component {
    _isMounted = false;

    constructor(props){
      super(props);

      var endpoint = "10.0.0.109:" + ENDPOINT_PORT;

      this.state = {
        data_lights: [
        {array_index: 0, value: 0},  
        {array_index: 1, value: 1},
        {array_index: 2, value: 0},
        {array_index: 3, value: 1},
        {array_index: 4, value: 0}],
        
        //null,
        data_switch: [
        {array_index: 0, delay_timer: 10, mode: 1, move_timer:0, toggle_timer: 0},
        {array_index: 1, delay_timer: 0, mode: 0, move_timer: 25, toggle_timer: 0},
        {array_index: 2, delay_timer: 0, mode: 0, move_timer: 0, toggle_timer: 18},
        {array_index: 3, delay_timer: 0, mode: 0, move_timer: 0, toggle_timer: 0},
        {array_index: 4, delay_timer: 0, mode: 0, move_timer: 0, toggle_timer: 0}
        ],
        //null,
        endpoint: endpoint,
        socket: socketIOClient(endpoint)
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