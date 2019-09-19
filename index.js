const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const _ = require('lodash');

const app = express();
module.exports = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_URL = process.env.TELEGRAM_BOT_URL;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;
const {commands} = require('./commands');

app.post(`/bot${TOKEN}`, async (req, res) => {

    const message = req.body.message.text;
    const chatId = req.body.message.chat.id;

    // CHECK IF COMMAND EXIST
    const command = _.find(commands, ['command', message.split(/ (.+)/)[0]]);

    if( command ){
        // CHECK IF EXIST ARGS
        const args = message.split(/ (.+)/)[1]
        const nMsg = await command.func( args );

        const response = await rp({
            method: 'POST',
            uri: `${TELEGRAM_API_URL}/sendMessage`,
            body: {
                chat_id: chatId,
                text: nMsg,
                parse_mode: 'HTML'
            },
            json: true,
        });
    }

    res.json({
        status: 'ok',
    });

});

app.get(`/register${TOKEN}`, async (req, res) => {
  const response = await rp({
    method: 'POST',
    uri: `${TELEGRAM_API_URL}/setWebhook`,
    body: {
      url: `${BOT_URL}/bot${TOKEN}`,
    },
    json: true,
  });
  console.log('====================================');
  console.log("response", response);
  console.log('====================================');
  res.json({
    status: 'ok',
    response,
  });
});

app.all('*', (req, res) => {
    console.log( "REQ:", req.body.message )
    res.status(405).send({ error: 'only POST requests are accepted' });
});