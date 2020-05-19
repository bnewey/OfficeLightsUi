const express = require('express');
var async = require("async");
const router = express.Router();

const logger = require('../../logs');
//Handle Database
const database = require('./db');

router.post('/getSwitchVariables', async (req,res) => {

    const sql = 'select s.id , s.array_index, s.type , s.name, s.description, s.x1, s.x2, s.y1, s.y2 ' +
    ' from switches s ORDER BY s.id';

    try{
        const results = await database.query(sql, []);
        logger.info("Got Switch Variables");
        res.json(results);
    }
    catch(error){
        logger.error("Switch (getSwitchVariables): " + error);
        res.sendStatus(400);
    }
});

router.post('/setSwitchVariables', async (req,res) => {
    var switchVariables;
    if(req.body){
        switchVariables = req.body.switchVariables;
    }

    const sql = 'UPDATE switches SET name=?, array_index= ?, type=? WHERE id = ? ';

    async.forEachOf(switchVariables, async (setting, i, callback) => {
        //will automatically call callback after successful execution
        try{
            const results = await database.query(sql, [setting.name, setting.array_index, setting.type, setting.id]);
            return;
        }
        catch(error){     
            //callback(error);         
            throw error;                 
        }
    }, err=> {
        if(err){
            logger.error(`Switch (setSwitchVariables):  ` + err);
            res.sendStatus(400);
        }else{
            logger.info(`setSwitchVariables success`);
            res.sendStatus(200);
        }
    })
});

router.post('/addSwitchVariable', async (req,res) => {
    var switchVariable;
    if(req.body){
        switchVariable = req.body.switchVariable;
    }

    const sql = 'INSERT INTO switches (array_index, type, name) VALUES (?,?,?)';

    try{
        const results = await database.query(sql, [switchVariable.array_index, switchVariable.type, switchVariable.name]);
        logger.info("Added Switch Variable");
        res.json(results);
    }
    catch(error){
        logger.error("Switch (addSwitchVariable): " + error);
        res.sendStatus(400);
    }
});

router.post('/removeSwitchVariable', async (req,res) => {
    var id;
    if(req.body){
        id = req.body.id;
    }

    const sql = 'delete from switches where id=?';

    try{
        const results = await database.query(sql, [id]);
        logger.info("Removed Switch Variable", id);
        res.json(results);
    }
    catch(error){
        logger.error("Switch (removeSwitchVariable): " + id +error);
        res.sendStatus(400);
    }
});

module.exports = router;