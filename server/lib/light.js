const express = require('express');
var async = require("async");
const router = express.Router();

const logger = require('../../logs');
//Handle Database
const database = require('./db');

router.post('/getLightVariables', async (req,res) => {

    const sql = 'select l.id , l.array_index , l.switch_id, l.type , l.name , l.description ' +
    ' from lights l ORDER BY l.id';

    try{
        const results = await database.query(sql, []);
        logger.info("Got Light Variables");
        res.json(results);
    }
    catch(error){
        logger.error("Light (getLightVariables): " + error);
        res.sendStatus(400);
    }
});

router.post('/setLightVariables', async (req,res) => {
    var lightVariables;
    if(req.body){
        lightVariables = req.body.lightVariables;
    }

    const sql = 'UPDATE lights SET name=?, array_index= ?, type=?, switch_id=? WHERE id = ? ';

    async.forEachOf(lightVariables, async (setting, i, callback) => {
        //will automatically call callback after successful execution
        try{
            const results = await database.query(sql, [setting.name, setting.array_index, setting.type, setting.switch_id, setting.id]);
            return;
        }
        catch(error){     
            //callback(error);         
            throw error;                 
        }
    }, err=> {
        if(err){
            logger.error(`Light (setLightVariables):  ` + err);
            res.sendStatus(400);
        }else{
            logger.info(`setLightVariables success`);
            res.sendStatus(200);
        }
    })
});

router.post('/addLightVariable', async (req,res) => {
    var lightVariable;
    if(req.body){
        lightVariable = req.body.lightVariable;
    }

    const sql = 'INSERT INTO lights (array_index, type, switch_id, name) VALUES (?,?,?,?)';

    try{
        const results = await database.query(sql, [lightVariable.array_index, lightVariable.type,lightVariable.switch_id ,lightVariable.name]);
        logger.info("Added Light Variable");
        res.json(results);
    }
    catch(error){
        logger.error("Light (addLightVariable): " + error);
        res.sendStatus(400);
    }
});

router.post('/removeLightVariable', async (req,res) => {
    var id;
    if(req.body){
        id = req.body.id;
    }

    const sql = 'delete from lights where id=?';

    try{
        const results = await database.query(sql, [id]);
        logger.info("Removed Light Variable", id);
        res.json(results);
    }
    catch(error){
        logger.error("Light (removeLightVariable): " + id +error);
        res.sendStatus(400);
    }
});

module.exports = router;