const socketIo = require("socket.io");
const net = require('net');
const logger = require('../logs');
const timeout = 10000; //timeout for retrying c++ socket connection
var retrying = false;
var io = null;

const getSocket = function(socketId){
    if(!io){
        return null;
    }

    if(socketId && io.sockets.connected[socketId]){
        return io.sockets.connected[socketId].broadcast;
    }else{
        return io;
    }
}


exports.setupIo = function(server, HOST, SOCKET_PORT){
    
    //Socket IO | sends data from node server to next frontend
    io = socketIo(server);

    io.on("connection", socket => {
        logger.verbose(`New client connected. Socket #${socket.id} `);

        
        //Handle UI events

        socket.on("ToggleLight", (array_index) => {
                 logger.info(`Array Index: ${array_index} | Toggle Light `);
                 writeToPort("05", array_index, null);
             });
        socket.on("RestartOfficeLights", () => {
            logger.info(`Array Index: ${array_index} | Toggle Light `);
            writeToPort("99", null, null);
        });

        socket.on("disconnect", () => {
            logger.verbose(`Client disconnected Socket #${socket.id}`);
        });
    });
}

const emitToFrontend = function(event, data) {
   let io = getSocket();
   if(!io){
       logger.info("No connection to FrontEnd found");
       return
   }
   io.emit(event, data);
}


     ////////////////////////////////////

 //TCP SOCKET | c++ to node
var client = new net.Socket();

exports.setupTCP = function(HOST, SOCKET_PORT, database) {

    function makeConnection () {
        
        client.connect(SOCKET_PORT, HOST, function() {
            
            
        });
    }
    function endEventHandler() {
        logger.info('end');
    }
    function timeoutEventHandler() {
        logger.info('timeout');
    }
    function drainEventHandler() {
        logger.info('drain');
    }

    function closeEventHandler () {
        
        client.destroy();
        if (!retrying) {
            
            retrying = true;
            emitToFrontend('Reconnect', {retrying: true, data:false});
            logger.warn('Reconnecting...');
        }
        setTimeout(makeConnection, timeout);
    }

    function errorEventHandler (err) {
        logger.error(err);
        //client.removeListener("error", errorEventHandler);
    }

    client.on('connect', function(){
       
        emitToFrontend('Reconnect', {retrying: false, data: false});
        logger.info('CONNECTED TO C++ Socket: ' + HOST + ':' + SOCKET_PORT);   
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
        writeToPort("01",null,null);
        retrying = false;
    });

    var i = 0;
    // data is what the server sent to this socket
    client.on('data', function(data) {
        let temp = data.toString();

        //Emit to nextjs components using SocketIO
        emitToFrontend('FromC', temp);

        //Let nextjs know we are both connected to c++ and getting data from USB
        emitToFrontend('Reconnect', {retrying: false, data:true});
        
        //write message to c++ so that it knows we are still connected
        writeToPort('00',null,null);
        
        //Send to logging mysql database every 1000 reads (around 5 minutes)
        if(i % 1000 == 0){ 
            //database.sendReadToSQL(temp);
            //logger.verbose("History data sent to MySQL");
        } 
        i++;
    });

    client.on('end',     endEventHandler);
    client.on('timeout', timeoutEventHandler);
    client.on('drain',   drainEventHandler);
    client.on('close', closeEventHandler);
    client.on('error', errorEventHandler);

    makeConnection();
}

//String to be sent will be 200 digits
//Params:
// Command: first two digits [0,1] (connected: 00, onConnect: 01 ||| stop: 02, start: 03, restart: 04, all_off: 05, all_on: 06, all_restart: 07 ||| write_to_port: 10 )
// switch_id: next two [2,3] (switch_id # 01 - 08)
// Blank: next two [4,5] (0,0)
// Data: next 194 digits [6-199] (0,0)
const writeToPort = function(command, switch_id, data ) {
    //Command
    if(!command){
        logger.warn("Write - Bad Command");
        return
    }
    //Switch Id
    if(switch_id){
        switch_id = switch_id.toString();
        while(switch_id.length < 3){
            switch_id =  "0" + switch_id
        }

    }
    if(!switch_id){
        switch_id = "000";
    }
    
    //data
    if(!data){ //4 0's
        data = "000";
    }
    while(data.length  < 12){
        data += "0";
    }

    var stringToWrite = command + switch_id; //+ "00" + data;
    client.write(stringToWrite);

    if(command != "00"){
        logger.verbose("%s -- sent to c++", stringToWrite);
    }
}   
