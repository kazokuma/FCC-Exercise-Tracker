//This is to set up an entry of exercise log
//The exerciselog gets a request object form server.js
//first to check if any userId given is in the database users
// if not in the database, body.userId will get an error message.
// The date will be validated by a function/validDate.

const {users} = require('../models/users.js');
const randomValueBase64 = require('../utils/crypto.js');
const db = require('mongodb');
const mongoose = require('mongoose');

const checkUserId = async (body) => {
  let dateOK = validDate(body);
  let newexercise = {
    description: body.description,
    duration: body.duration,
    date: body.date ? new Date(body.date) : Date()
  };
  return new Promise ((resolve, reject) => {
    if(dateOK) {
      users.findByIdAndUpdate({_id: body.userId}, {$push: {exercise: newexercise}}, (error, doc) => {
            if(error) { console.log("Error happened:  " + error);
                   reject(error) ;
            }
            if(doc) {
                  body.userId = body.userId + "     Registered";
                  resolve(body);
            }
            else {body.userId = "Error:  The userId is not registred!!   " + body.userId;
                  resolve(body);
            }          
      });
    }
    else {
        body.userId = "Error:   " + body.userId;
        body.date = "Error: The date is not correct!!    " + body.date;
          resolve(body);
    }
})
};

//This function checks if the date given in the body is valid.
const validDate = (body) => {
  let today = new Date(Date.now());
  let dArray = body.date ? body.date.split('-') : [today.getFullYear(), today.getMonth() + 1, today.getDate()];
  let date = new Date(`${dArray[0]}-${dArray[1]}-${dArray[2]}`);
  let isValidDate = (Boolean(+date) && date.getDate() == dArray[2]);
  return isValidDate;
}
  
module.exports = {checkUserId};
