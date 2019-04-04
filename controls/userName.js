// To check if there is username in users db
// This process generates random valuable as 8 digit base64 characters(randomValueBase64)

const {users} = require('../models/users.js');
const randomValueBase64 = require('../utils/crypto.js');
const db = require('mongodb');
const mongoose = require('mongoose');

const checkUser = async (userName) => {
  let arr = await users.findOne({username: userName});
  if(arr) return {status: true, username: userName}
  else return {status: false, username: userName}
  }


const addUser = async (response) => {
  if(response.status) return {username:response.username, _id: "Already Registered!"};
  else {
  let randomValue = randomValueBase64(8);
  let newuser = new users({username: response.username, _id: randomValue});
  const newUser = await newuser.save();
  return {username:response.username, _id: randomValue};
  }
}


module.exports = {checkUser, addUser};
