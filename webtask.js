'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import request from 'request';
import Webtask from 'webtask-tools';

const server = express();

var sendToGroupMe = function(text, groupId, botId, cb) {
  request.post("https://api.groupme.com/v3/bots/post", 
    {json: {"bot_id": botId, "text": text}},
    (err, res, body) => {
      if (!err && res.statusCode >= 200 && res.statusCode < 300) {
        cb(null, `Successfully posted message \'${text}\'`);
      }
      else cb(err);
    }
  );
};

server.use(bodyParser.json());
server.get('/', (req, res, next) => {
    res.status(200).send('Hello there!');
});

// Receives webhooks POSTS from Zapier
server.post('/', (req, res, next) => {
  const { GROUPME_GROUP_ID, GROUPME_BOT_ID } = req.webtaskContext.data;
  const body = JSON.parse(req.body);
  const link = body.link;
  const name = body.name;
  const created = body.created;
  const updated = body.updated;
  let message =   `New version available\n`;
  message += `Name: ${name}\n`;
  message += `Created: ${created}\n`;
  message +=  `Updated: ${updated}\n`;
  message += `Link: ${link}`;
  console.log( JSON.stringify(body,null, 2));
  console.log(message);
  //sendToGroupMe(message, GROUPME_GROUP_ID, GROUPME_BOT_ID,  (err, result) => {
  //  if (err) res.status(500).send(`Failed to send to Groupme ${err}`);
  //  else res.status(200).send('success');
  //});
  res.status(200).send('success');
});

module.exports = Webtask.fromExpress(server);
