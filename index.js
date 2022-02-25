const express = require('express');
const uuid = require('uuid');
const DF = require("./dfservice");
const twilio = require('./twilio');
const app = express();

const port = process.env.PORT || 3000;
const sessionIds = new Map();

app.use(express.urlencoded());
app.use(express.json());

app.post('/', async (req, res) => {
    const sender = req.body.From;
    const text = req.body.Body;
    const from = req.body.To;
    console.log(req.body);
    setSessionAndUser(sender);
    let response;
    try {
        response = await DF.sendTextQueryToDialogFlow(sessionIds, sender, text);
        console.log(response.intent.displayName);
        const validImageIntents = ['consultaListaCursos','consultaPago','consultaContacto'];
        if (validImageIntents.includes(response.intent.displayName)) {

            await twilio.sendTextImage(from, response.fulfillmentText || response.queryText, sender, response.fulfillmentMessages[response.fulfillmentMessages.length-1].payload.fields.mediaUrl.stringValue).then(m => console.log(m.sid))
        }else{

            await twilio.sendText(from, response.fulfillmentText || response.queryText, sender).then(m => console.log(m.sid))
        }
    } catch (error) {
        console.log(error)
    }
});
app.get('/',(req, res) => {
    res.send('Hello');
} )

function setSessionAndUser(senderID) {
    if (!sessionIds.has(senderID)) {
        sessionIds.set(senderID, uuid.v1());
    }
}

app.listen(port, () => console.log(`Magic on ${port}`));
