const express = require('express');
var async = require("async");
const router = express.Router();

const logger = require('../../logs');
//Handle Database
const database = require('./db');

router.post('/getSwitchVariables', async (req,res) => {

    const sql = 'select s.id , s.array_index, s.type , s.name, s.description ' +
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

    const sql = 'UPDATE switch_variables SET value= ? WHERE tag = ? ';

    async.forEachOf(switchVariables, async (setting, i, callback) => {
        //will automatically call callback after successful execution
        try{
            const results = await database.query(sql, [setting.value, setting.tag]);
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

module.exports = router;