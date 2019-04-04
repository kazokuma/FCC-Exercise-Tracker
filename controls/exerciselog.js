//This process is to produe exercise logs for the request given in the form /api/exercise/log?userid={ }&from=yyyy-mm-dd&to=yyyy-mm-dd&limit=Number
//This process also creates all the log with only userid given.
//Also validate if the userid given is in the database/users, if not, send back an error object to server.js



const {users} = require('../models/users.js');
const randomValueBase64 = require('../utils/crypto.js');
const db = require('mongodb');
const mongoose = require('mongoose');

const exerciselog = (request) => {
    let userid = request.userid;
    let from = new Date(request.from ?  request.from : "1970-01-01");  //with no entry, the entry of the lowest date to pick up every data entered
    let to = new Date(request.to ? request.to : "2999-12-31");  // with no entry, the entry of the highest number to pick up every data entered
    let limit = request.limit ? request.limit : 99999; //with no entry, the entry of the highest number to pick up every data entered
  return new Promise((resolve, reject) => {  
    users.find({_id: userid}, {exercise: 1}, (error, arr) => {
      if(error) { console.log("Error!  " +  error);
                  reject(error);}
      let [object] = arr;  //Note:  [] is not undefined/null/false so but by setting [object] = [] object will be undefined/null/false
      if (!object) {
          let object ={_id: "error", exercise: ["A wrong userId"]};
          console.log("wrong user id, no user was found  " + userid)
          resolve(object);
        }
        else {
          let newArray = object.exercise.filter( (a) => {return from.getTime() <= a.date.getTime() && a.date.getTime() <= to.getTime()})
                .sort((a, b) => (a.date.getTime() - b.date.getTime()));
          if(newArray.length > request.limit) {
            let tempArray = newArray
            newArray = tempArray.slice(0, request.limit);  
          }
          object.exercise = newArray;  // to insert new array to the object so that object can send userid to other program.
          resolve(object);        
        }
      }
    );    
    });
};

module.exports = {exerciselog};