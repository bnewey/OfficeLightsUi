import React, {useRef, useState, useEffect} from 'react';

import {makeStyles,Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
    Backdrop, Fade, Grid, TextField, Button, Tooltip} from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Clear';

import cogoToast from 'cogo-toast';
import { confirmAlert } from 'react-confirm-alert'; // Import
import ConfirmYesNo from '../UI/ConfirmYesNo';

import socketIOClient from 'socket.io-client';

import Switch from '../../js/Switch';


const SettingsGroup = (props) => {

    const {endpoint, socket,modalOpen, settingName, handler, tableConfig, width, setShouldAskRestart} = props;
    
    
    //Functional State
    const [shouldSave, setShouldSave] = React.useState(false);
    const [shouldRefetch, setShouldRefetch] = React.useState(false);
    const [settingVariables, setSettingVariables] = React.useState(null);
    //Dialog
    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const [addDialogVariables, setAddDialogVariables] = React.useState({});

    const classes = useStyles({...props, shouldSave});

    useEffect(()=>{
        if( ( modalOpen && (!settingVariables || settingVariables == [])  ) || shouldRefetch) {
            handler.getVariables()
            .then( (data)=>{
                setSettingVariables(data);
            })
            .catch(error => {
                console.log(error);
                cogoToast.error(error);
            })

            if(shouldRefetch){
                setShouldRefetch(false);
            }
        }
        

        return(()=>{
            setSettingVariables(null);
            setShouldSave(false);
        })
    },[modalOpen, shouldRefetch])





    const onChangeNumberValue = (event, id, setting, type) => {
        if(!(type == "number")){
            console.error("Type is not a number");
            cogoToast.error("Bad type");
            return;
        }
        let newValue = event.target.value;
        if(newValue == null ){
            cogoToast.error(`Bad value!`, {hideAfter: 3});
            return;
        }
        if(newValue > 999 || newValue < 0){
            cogoToast.error(`Too big or too small number!`, {hideAfter: 3});
            return;
        }

        //Get the index of our value to change
        let indexOfMV;
        settingVariables.map((item, i)=> {
            if(item.id == id){
                indexOfMV=i;
                return true;
            }
        });

        //Copy settingVariables to temp array
        var variableCopy = [...settingVariables];

        
        if(indexOfMV == null){
            cogoToast.error(`Couldnt find variable!`, {hideAfter: 3});
            return;
        }
        //Edit tmp array and set real array
        variableCopy[indexOfMV][setting] = parseInt(newValue,10);
        setSettingVariables(variableCopy);
        
        //We should save if save is hit
        setShouldSave(true);


    }

    const onChangeStringValue = (event, id, setting, type) => {
       
        if(!(type == "text")){
            console.error("Type is not text");
            cogoToast.error("Bad type");
            setShouldSave(false);
            return;
        }
        let newValue = event.target.value;
        if(newValue == null ){
            cogoToast.error(`Bad value!`, {hideAfter: 3});
            setShouldSave(false);
            return;
        }
        if(newValue.length == 0 || newValue.length > 30){
            cogoToast.error(`Too big or too small text!`, {hideAfter: 3});
            setShouldSave(false);
            return;
        }

        //Get the index of our value to change
        let indexOfMV;
        settingVariables.map((item, i)=> {
            if(item.id == id){
                indexOfMV=i;
                return true;
            }
        });

        //Copy settingVariables to temp array
        var variableCopy = [...settingVariables];

        
        if(indexOfMV == null){
            cogoToast.error(`Couldnt find variable!`, {hideAfter: 3});
            return;
        }
        //Edit tmp array and set real array
        variableCopy[indexOfMV][setting] = newValue;
        setSettingVariables(variableCopy);
        
        //We should save if save is hit
        setShouldSave(true);


    }

    const handleSave = (event, arrayToSave) =>{
        if(!arrayToSave || arrayToSave == []){
            cogoToast.error(`Error getting switch variables`, {hideAfter: 4});
            return;
        }

        if(!shouldSave){
            //handleModalClose();
            return;
        }

        handler.setVariables(arrayToSave)
        .then( response => { 
            if(response){
                cogoToast.success(`Saved Switch Variables`, {hideAfter: 4});
                setShouldAskRestart(true);
                setShouldSave(false);
            }else{
                cogoToast.warn("Bad reponse from server; Something may have gone wrong with saving");
            }
            
            //Refetch variables
            setShouldRefetch(true);
        })
        .catch( error => {
            console.warn(error);
            cogoToast.error(`Error saving switch variables`, {hideAfter: 4});
        });
        
    }

    const handleAdd = (event, settingVariables, tableConfig) => {
        if(!settingVariables){
            console.error("Invalid settingVariables for handleAdd")
            return;
        }

        handler.addVariable(settingVariables)
        .then((response)=>{
            if(response){
                cogoToast.success("Successfully added");
                setShouldAskRestart(true);
            }else{
                cogoToast.warn("Bad response; Something may have gone wrong with adding");
            }
            setAddDialogOpen(false);
            setAddDialogVariables({});
            //Refetch variables
            setShouldRefetch(true);
        })
        .catch((err)=>{
            console.error(err);
            cogoToast.error("Error adding varible");
        });

    }

    const handleDeleteVariable = (event, setting_id) =>{
        if(!setting_id){
            console.error("Invalid id for handleDeleteVariable")
            return;
        }
        
        const remove = () =>{
            handler.removeVariable(setting_id)
            .then((response)=>{
                if(response){
                    cogoToast.success("Successfully removed");
                    setShouldAskRestart(true);
                }else{
                    cogoToast.warn("Bad response; Something may have gone wrong with removing");
                }
                setAddDialogOpen(false);
                setAddDialogVariables({});
                //Refetch variables
                setShouldRefetch(true);
            })
            .catch((err)=>{
                console.error(err);
                cogoToast.error("Error removing varible");
            });
        }
        

        confirmAlert({
            customUI: ({onClose}) => {
                return(
                    <ConfirmYesNo onYes={remove} onClose={onClose} customMessage="Deleting... Are you sure?"/>
                );
            }
        })
    }

    const openAddDialog = (event) =>{
        setAddDialogOpen(true);
    }

    const closeAddDialog = () => {
        setAddDialogVariables({});
        setAddDialogOpen(false);
    }

    return(
        <>
        {settingVariables ? 
            <>
            <div className={classes.root}>
                        <Grid item xs={12} className={classes.inputs_div}>
                            <span className={classes.input_group_label}>{settingName}</span>
                            <div className={classes.input_container_div}>
                                    {/* Column Head */}
                                    <div className={classes.flex_container_div}>
                                        {tableConfig.map((item,i)=>(
                                            <div className={ item.setting == "name" ? classes.column_head_name : classes.column_head_div} style={{textAlign: 'center'}}>
                                                <Tooltip title={item.description} placement="top">
                                                <span>{item.setting}</span> 
                                                </Tooltip>
                                                
                                            </div>
                                        ))
                                        }

                                        <div className={classes.input_div_x}>
                                            <span className={classes.delete_span}>&nbsp;</span>
                                        </div>
                                    </div>
                                    {/* Variables */}
                                    { settingVariables.map((setting, i)=>{
                                        return(
                                        <>                                        
                                        <div className={classes.flex_container_div}>
                                            
                                                {tableConfig.map((item, i)=> (
                                                    <div className={ item.setting == "name" ? classes.label_div : classes.input_div}>
                                                        <input className={item.setting == "name" ? classes.input_label : classes.input} 
                                                            type={setting.type} 
                                                            id={`input-${setting.id}-i`}  
                                                            defaultValue={setting[item.setting]}
                                                            onChange={event => item.type == "text" ? 
                                                                        onChangeStringValue(event, setting.id, item.setting, item.type) :
                                                                        /*number*/ onChangeNumberValue(event, setting.id, item.setting, item.type)}
                                                        />
                                                    </div>
                                                ))}

                                                <div className={classes.input_div_x}  onClick={event=> handleDeleteVariable(event, setting.id)}>
                                                    <span className={classes.delete_span}><DeleteIcon classes={{root: classes.trash_icon}}/></span>
                                                </div>
                                        </div> 
                                        </>
                                    )})}
                            </div>
                            
                            
                        </Grid>
            <Grid item xs={12} className={classes.paper}>
                <div className={classes.footer_div}>
                <Button className={classes.add_button} variant="contained" color="primary" onClick={event => openAddDialog(event)}>
                    Add
                </Button>
                <Button className={classes.save_button} variant="contained" color="primary" onClick={event => handleSave(event, settingVariables)}>
                    Save
                </Button>
                </div>
            </Grid>
            </div>

                {/* DIALOG */}
                { addDialogOpen ?
                <Dialog open={addDialogOpen} onClose={closeAddDialog}>
                    <DialogTitle className={classes.dialogTitle}>Add {settingName}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <FormControl className={classes.inputField}>
                                <div className={classes.dialog_input_container_div}>
                                        {/* Column Head */}
                                        <div className={classes.flex_container_div}>
                                            {tableConfig.map((item,i)=>(
                                                <div className={item.setting == "name" ? classes.column_head_name : classes.column_head_div} style={{textAlign: 'center'}}>
                                                    <Tooltip title={item.description} placement="top">
                                                    <span>{item.setting}</span> 
                                                    </Tooltip>
                                                    
                                                </div>
                                            ))
                                            }
                                        </div>
                                        {/* Variables */}
                                            <div className={classes.flex_container_div}>
                                                    {tableConfig.map((item, i)=> (
                                                        <div className={ item.setting == "name" ? classes.label_div : classes.input_div}>
                                                            <input className={item.setting == "name" ? classes.input_label : classes.input} 
                                                                type={item.type}
                                                                value={addDialogVariables[item.setting]}
                                                                onChange={event => {
                                                                    let tmpVars = {...addDialogVariables};
                                                                    tmpVars[item.setting] = event.target.value;
                                                                    setAddDialogVariables({...tmpVars})
                                                                } }
                                                            />
                                                        </div>
                                                    ))}
                                                
                                            </div> 
                                </div>
                        </FormControl>
                        <DialogActions>
                        <Button onClick={closeAddDialog} color="primary">
                            Cancel
                        </Button>
                        {addDialogVariables ? <Button
                            onClick={event => handleAdd(event, addDialogVariables, tableConfig)}
                            variant="contained"
                            color="secondary"
                            size="medium"
                            className={classes.saveButton} >
                            Add {settingName}
                            </Button>
                        :<></> }   
                    </DialogActions> 
                    </DialogContent>
                </Dialog>
                : <></>}
                {/* END OF DIALOG */}
            </>
        : <></>}
        </>
    );
};

export default SettingsGroup;


const useStyles = makeStyles(theme => ({
    root:{
        width: props => `${props.width}%`,
        margin: '1%',
        boxShadow: theme.shadows[5],
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        
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
    input_container_div:{
        padding: '0% 1%',
        backgroundColor: '#efefef',
        
        display: 'block',
    },
    flex_container_div:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    input_label:{
        fontSize: '13px',
        fontWeight: '500',
        color: '#3b2323',
        whiteSpace: 'nowrap',
        float: 'left',
        width: '80%',
    },
    label_div:{
        textAlign: 'right',
        clear: 'both',
        float:'left',

        flexBasis:'45%',
    },
    input_div:{
        flexBasis: '25%',
        textAlign: 'right',
        //width: '100%',
    },
    input_div_x:{
        flexBasis: '10%',
        textAlign: 'center',
        '&:hover':{
            color: '#c54102',
            boxShadow: ' 0px 1px 8px 0px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            backgroundColor: '#b6d6f0',
        }
    },
    delete_span:{
        width:'80%',
        padding: '0% 5% 0% 5%',
        boxSizing: 'border-box',
        webkitBoxSizing:'border-box',
        mozBoxSizing: 'border-box',
        
    },
    column_head_div:{
        flexBasis: '25%',
        textAlign: 'center',
        fontSize: '.8em',
        fontWeight:'500',
        color: '#ab5e00',
        background: 'linear-gradient( #dedede, #f4f4f4, #bcbcbc)',
    },
    column_head_name:{
        flexBasis: '45%',
        textAlign: 'center',
        fontSize: '.8em',
        fontWeight:'500',
        color: '#ab5e00',
        background: 'linear-gradient( #dedede, #f4f4f4, #bcbcbc)',
    },
    input:{
        width:'80%',
        margin: '0% 1% 0% 2%',
        boxSizing: 'border-box',
        webkitBoxSizing:'border-box',
        mozBoxSizing: 'border-box',
    },
    input_group_label:{
        fontWeight: '500',
        fontSize: '18px',
        color: '#fff',
        backgroundColor:'#0968cf',
        textAlign: 'center',
        display: 'block',
    },
    trash_icon:{
        width: '.7em',
        height: '.7em',
    },
    save_button:{
        backgroundColor: '#0968cf',
        '&:hover':{
            backgroundColor: '#5096e2',

        },
        border: props=>props.shouldSave ? '2px solid #ff7600' : '',
        color: props=>props.shouldSave ? '#ffc797' : '',

    },
    add_button:{
        backgroundColor: '#0968cf',
        '&:hover':{
            backgroundColor: '#5096e2',

        },

    },
    //Dialog CSS
    dialogTitle:{
        '&& .MuiTypography-root':{
            fontSize: '16px',
            color: '#fff',
            lineHeight: '1',
        },
        
        backgroundColor: '#0968cf',

    },
    dialogContent:{
        padding: '5%',
        minWidth: '500px',
    },
    dialog_input_container_div:{
        padding: '3% 1%',
        backgroundColor: '#efefef',
        
        display: 'block',
    },
    //End of Dialog Css


    
  }));

