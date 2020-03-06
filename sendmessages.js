const { EventHubClient } = require("@azure/event-hubs");



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

const config = require('config');
const dotenv = require('dotenv');
dotenv.config();
async function main() {

  
  //...

  const evenhubnamespace = process.env.EVENTHUBNAMESP;
  const eventhubname = process.env.EVENTHUBNAME;
  const SharedAccessKeyName = process.env.SHAREDACCESSKNAME;
  const SharedAccessKey = process.env.SHAREDACCESSKEY;
  const eventhubconstring = `Endpoint=sb://${evenhubnamespace}.servicebus.windows.net/;SharedAccessKeyName=${SharedAccessKeyName};SharedAccessKey=${SharedAccessKey};EntityPath=${eventhubname}`;
  



  const eventbody = config.get('messagedetails.messagebody');

  const uniqueguidfield = config.get('messagedetails.uniqueguidfield');
  const uniquetimefield = config.get('messagedetails.timestampfield');


  
  const client = EventHubClient.createFromConnectionString(eventhubconstring);
  const messagespertrigger = config.get('messagespertriger');
  

  for (let i = 0; i < messagespertrigger; i++) {
    const currenttimestamp =  new Date(new Date().toUTCString());
    const symbolindex = getRandomIntInclusive(0,9) ;
    const uuidv4 = require('uuid/v4');
 
    const eventData = `{body: ${JSON.stringify(eventbody)}, "${uniqueguidfield}": ${uuidv4()}, "${uniquetimefield}" : ${currenttimestamp}  }`;
    
    console.log(`sending ${eventData}`);

    await client.send({body: eventData});
  }

  await client.close();
}
const interval  = config.get('waitintervalinms')
setInterval(main,interval);


