const express = require('express');

var async = require("async");
const router = express.Router();

const logger = require('../../logs');
//Handle Database
//const database = require('./db');

const _ = require('lodash');

    function publicFields() {
      return [
        'id',
        'displayName',
        'email',
        'avatarUrl',
        'slug',
        'isAdmin',
      ];
    }
  
async function signInOrSignUp({ database, googleId, email, googleToken, displayName, avatarUrl,  }) {
  
  const user = await getUserByGoogleId(  database, googleId );
  console.log("SignInOrSignUp GoogleToken", googleToken);
  if (user) {
    const modifier = {};

    if (googleToken.accessToken) {
      modifier.access_token = googleToken.accessToken;
    }

    if (googleToken.refreshToken) {
      modifier.refresh_token = googleToken.refreshToken;
    }

    if (_.isEmpty(modifier)) {
      return user;
    }

    if(!(await updateUserGoogleToken( database, googleId , modifier))){
      console.error("Failed to update GoogleToken");
    }

    return user;
  }

  const slug = await generateSlug(database, this, displayName);
  //const userCount = await find().countDocuments();

  const newUser = await createUser({ database,
    createdAt: new Date(),
    googleId,
    email,
    googleToken,
    displayName,
    avatarUrl,
    slug,
    isAdmin: true,
  });

  if(newUser){
    return _.pick(await getUser( database, slug), UserClass.publicFields());
  }else{
    console.error("Failed to create User");
    return {};
  }

}


async function getUser (database, slug) {
  const sql = 'select * from users where slug = ?';

  try{
      const results = await database.query(sql, [slug]);
      logger.info("Got User");
      var user = await json(results);
      return (user);
  }
  catch(error){
      logger.error("User (getUser): " + error);
      return 0;
  }

};

async function  getUserByGoogleId (database, google_id) {
  const sql = 'select * from users u LEFT JOIN googleToken gt ON u.googleTokenId = gt.id WHERE u.googleId = ? ;';

  try{
      const results = await database.query(sql, [google_id]);
      logger.info("Got User By GoogleId");
      var user = await json(results);
      return (user);
  }
  catch(error){
      logger.error("User (getUserByGoogleId): " + error);
      return 0;
  }
};

async function  getUserById (database, id) {
  const sql = 'select * from users u LEFT JOIN googleToken gt ON u.googleTokenId = gt.id WHERE u.id = ? ;';

  try{
      const results = await database.query(sql, [id]);
      logger.info("Got User By Id");
      var user = await json(results);
      return (user);
  }
  catch(error){
      logger.error("User (getUserById): " + error);
      return 0;
  }
};

async function updateUserGoogleToken (database, google_id, modifier) {
  const sql = 'UPDATE googleToken SET gt.accessToken=?, gt.refreshToken=? WHERE gt.id = (SELECT u.googleTokenId FROM users u WHERE u.googleId = ? ) ';

  try{
      const results = await database.query(sql, [modifier.accessToken, modifier.refreshToken, google_id]);
      logger.info("Update UserGoogleToken");
      var response = await json(results);
      return (response.ok);
  }
  catch(error){
      logger.error("User (updateUserGoogleToken): " + error);
      return 0;
  }
};

async function createUser ({database, createdAt, googleId,email,googleToken,displayName,avatarUrl,slug,isAdmin}) {
  const sql = 'INSERT INTO googleToken (accessToken, refreshToken, tokenType, expiryDate) VALUES (?, ? , ? , ?) ;' + 
  ' INSERT INTO users (googleId, googleTokenId, slug, createdAt, email, isAdmin, displayName, avatarUrl) VALUES (?, LAST_INSERT_ID(), ?, ?, ?, ?, ?,?) ;';
  
  console.log("Creaate User", JSON.stringify(googleToken));
  try{
      const results = await database.query(sql, [googleToken.accessToken, googleToken.refreshToken, googleToken.tokenType, googleToken.expiryDate,
                                          googleId, slug, createdAt, email, isAdmin, displayName, avatarUrl ]);
      logger.info("Created User");
      var response = await json(results);
      return (response.ok );
  }
  catch(error){
      logger.error("User (createUser): " + error);
      return 0;
  }
};  


const json = function(object) {
    return new Promise( (resolve,reject) => { 
        
            var parsed = JSON.parse(JSON.stringify(object));
            if(parsed){
                resolve(parsed[0]);
                return;
            }else{
                reject({error: "Error"});
            }
    })
}

//Slugify
const slugify = text => _.kebabCase(text);

async function generateSlug(database, Model, name, filter = {}) {
  const origSlug = slugify(name);

  const user = await Model.getUser( database, origSlug);

  if (!user) {
    return origSlug;
  }

  return createUniqueSlug(database ,Model, origSlug, 1);
}

async function createUniqueSlug(database, Model, slug, count) {
  const user = await Model.getUser(database, `${slug}-${count}`);

  if (!user) {
    return `${slug}-${count}`;
  }

  return createUniqueSlug(database, Model, slug, count + 1);
}
//////////////


//const User = new UserClass;

module.exports = {
  signInOrSignUp: signInOrSignUp,
  getUser: getUser,
  getUserByGoogleId:getUserByGoogleId,
  getUserById:getUserById,
  updateUserGoogleToken: updateUserGoogleToken,
  createUser: createUser,
};