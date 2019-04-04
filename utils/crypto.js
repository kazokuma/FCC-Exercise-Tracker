// This is a function to genrate base64 random charactors
// To eliminate  +  and / to '0'
const crypto = require('crypto');

const randomValueBase64 = (len) => {
    return crypto
        .randomBytes(Math.ceil((len * 3)/4))
        .toString('base64')
        .slice(0, len)
        .replace(/\+/g, '0')
        .replace(/\//g, '0') 
}

module.exports = randomValueBase64;