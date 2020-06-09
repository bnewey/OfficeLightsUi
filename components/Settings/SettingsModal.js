import React, {useRef, useState, useEffect} from 'react';

import {makeStyles,Fab, Modal, Backdrop, Fade, Grid, TextField, Button, Paper, Tab, Tabs} from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Settings';

import cogoToast from 'cogo-toast';
import { confirmAlert } from 'react-confirm-alert'; // Import
import ConfirmYesNo from '../UI/ConfirmYesNo';

import socketIOClient from 'socket.io-client';

import Switch from '../../js/Switch';
import Light from '../../js/Light';
import SettingGroup from './SettingGroup';

const tableConfig = 
{  "Switches": [
        { "setting": "name", "type": "text", "description": "Switch name"},
        { "setting": "array_index", "type": "number", "description": "Switches will have array index between 0-150"},
        { "setting": "type", "type": "number", "description": "Type=0 means single switch, Type=1 means double switch"},
        { "setting": "x1", "type": "float", "description": "left x location"},
        { "setting": "x2", "type": "float", "description": "right x location"},
        { "setting": "y1", "type": "float", "description": "Top y location"},
        { "setting": "y2", "type": "float", "description": "Bottom y location"},
    ],
    "Lights": [
        { "setting": "name", "type": "text", "description": "Light name"},
        { "setting": "array_index", "type": "number", "description": "Lights will have array index between 151-300"},
        { "setting": "type", "type": "number", "description": "Type = 0 for now"},
        { "setting": "switch_id", "type": "number", "description": "Switch that this light belongs to. If Dbl Switch, put first id, the second is +1"}
    ],
} 
    


const SettingsModal = (props) => {

    const {endpoint, socket, setShouldResetData} = props;
    const classes = useStyles();

    //Modal Props
    const [modalOpen, setModalOpen] = React.useState(false);
    
    //Functional State
    const [switchVariables, setSwitchVariables] = React.useState(null);
    const [lightVariables, setLightVariables] = React.useState(null);
    const [shouldAskRestart, setShouldAskRestart] = React.useState(false);
    const [tabValue, setTabValue] = React.useState(0);

    const handleModalOpen = (event) => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        const pollRestart = () =>{
            socket.emit('RestartOfficeLights', "RestartOfficeLights");
            setShouldAskRestart(false);
            setModalOpen(false);
            setShouldResetData(true);
        }

        //If data was saved or deleted
        if(shouldAskRestart){
            confirmAlert({
                customUI: ({onClose}) => {
                    return(
                        <ConfirmYesNo onYes={pollRestart} onClose={onClose} customMessage="You've made changes, restart is required. Restart?"/>
                    );
                }
            });
        }else{
            setModalOpen(false);
        }

        
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };



    return(
        <>
        <Fab color="primary" aria-label="add" className={classes.settingsButton} onClick={handleModalOpen}>
          <SettingsIcon color="#fff" className={classes.settingsIcon}/>
        </Fab>

        <Modal aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalOpen}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
             }}>
            <Fade in={modalOpen}>
                <div className={classes.container}> 
                <Grid container >  
                    <div className={classes.modalTitleDiv}>
                        <span id="transition-modal-title" className={classes.modalTitle}>
                            Settings
                        </span>
                    </div>
                    <Grid item xs={12} className={classes.paper}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Lights/Switch" />
                    </Tabs>

                        {tabValue == 0 ?
                        <div className={classes.form_container}>
                            
                            <SettingGroup endpoint={endpoint} socket={socket} modalOpen={modalOpen} settingName={"Switch"} handler={Switch}
                                     tableConfig={tableConfig.Switches} width={35} setShouldAskRestart={setShouldAskRestart}/>
                            <SettingGroup endpoint={endpoint} socket={socket} modalOpen={modalOpen} settingName={"Light"} handler={Light}
                                     tableConfig={tableConfig.Lights} width={30} setShouldAskRestart={setShouldAskRestart}/>
                        </div>: <></> }
                        
                    
                    </Grid>
                    <Grid item xs={12} className={classes.paper}>
                        <div className={classes.footer_div}>
                        <Button variant="contained" color="primary" onClick={event => handleModalClose(event)}>
                            Close
                        </Button>
                        </div>
                    </Grid>
                </Grid>
                </div>
            </Fade>
        </Modal>

        </>
    );
};

export default SettingsModal;


const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1 !important',
        '&& div':{
            outline: 'none',
        },
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '2% 3% 3% 3% !important',
        position: 'relative',
        width: '100%',
        overflowY: 'auto',
        maxHeight: '665px',

        background: 'linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .52), rgba(0, 0, 0, 0)) 0 100%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
        /* Opera doesn't support this in the shorthand */
        backgroundAttachment: 'local, local, scroll, scroll',
    },
    container: {
        width: '60%',
        maxWidth: '60%',
        textAlign: 'center',
    },
    modalTitleDiv:{
        backgroundColor: '#4d98e6',
        padding: '5px 0px 5px 0px',
        width: '100%',
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '300',
        color: '#fff',
    },
    settingsButton:{
        position: 'fixed',
        bottom: '2%',
        right: '1%',
        backgroundColor: '#0968cf',
        '&:hover':{
          backgroundColor: '#7895af',
        }
    },
    settingsIcon:{
    
    },
    form_container:{
        background: '#ececec',
        borderRadius: '4px',
        display:'flex',
        flexDirection: 'row',
        boxShadow: 'inset 0 0 5px 3px #4e4e4e29',
    },
    inputs_div:{
        
        
    },
    input_container_div:{
        padding: '0% 1%',
        backgroundColor: '#efefef',
        
        display: 'block',
    },
    input_label:{
        fontSize: '13px',
        fontWeight: '500',
        color: '#3b2323',
    },
    label_div:{
        textAlign: 'right',
        clear: 'both',
        float:'left',
        marginRight:'15px',
    },
    input_div:{
        textAlign: 'right',
    },
    input:{
        margin: '0% 1% 0% 2%',
        maxWidth: '20%',
        width: '20%',
    },
    input_group_label:{
        fontWeight: '500',
        fontSize: '18px',
        color: '#fff',
        backgroundColor:'#858c98',
        textAlign: 'center',
        display: 'block',
    },
    footer_div:{

    },


    
  }));

