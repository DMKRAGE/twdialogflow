const dialogflow = require('dialogflow');
require('dotenv').config();



const credentials = {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
};

const sessionClient = new dialogflow.SessionsClient({
    projectId: process.env.PROJECT_ID,
    credentials
});


module.exports = {

    async sendTextQueryToDialogFlow(sessionIds, sender, text, params = {}) {
        const sessionPath = sessionClient.sessionPath(process.env.PROJECT_ID, sessionIds.get(sender));
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'es',
                },
            },
        };
        const responses = await sessionClient.detectIntent(request);

        return responses[0].queryResult;

    },


    async sendEventToDialogFlow(sessionIds, handleDialogFlowResponse, sender, event, params = {}) {
        const sessionPath = sessionClient.sessionPath(process.env.PROJECT_ID, sessionIds.get(sender));
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(params), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: 'es',
                },
            }
        };


        const responses = await sessionClient.detectIntent(request);

        const result = responses[0].queryResult;
        handleDialogFlowResponse(sender, result);

    }


}