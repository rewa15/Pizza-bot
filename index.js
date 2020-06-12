'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
  
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://pizzabot-ngffmt.firebaseio.com/'
  
});
 
process.env.DEBUG = 'dialogflow:debug';
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function placeOrder(agent)
  {
    const order = agent.parameters.VegPizza;
    const phoneNo = agent.parameters.MobileNumber;
    
    return admin.database().ref('orders').push({      
      phoneNo: phoneNo,
      order: order      
    });
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Placing Orders', placeOrder);
  // intentMap.set('GetOrder', getOrder);
  agent.handleRequest(intentMap);
});
