require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNTSID,process.env.AUTHTOKEN);



function sendTextImage(from, message, to, image) {
    console.log(from,message, to, image);
    
    return client.messages
        .create({
            from: from,
            body: message,
            to: to,
            mediaUrl :image
        })
}

function sendText(from, message, to) {
    console.log(from,message, to);
    
    return client.messages
        .create({
            from: from,
            body: message,
            to: to
        })
}

module.exports = { sendText,sendTextImage }