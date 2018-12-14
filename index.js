const Discord = require('discord.js');
const client = new Discord.Client();

const express = require('express');
const api = express();

const bodyParser = require('body-parser');
api.use(bodyParser.json());

client.config = require('./src/config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// client.on('message', msg => {
//     if (msg.content === 'ping') {
//         msg.reply('Pong!');
//     }
// });

const bannedWords = require('./src/banned-words.js');

messagesEvent = (msg) => {
    if (msg.author.bot) return;
    
    if(msg.content.match(bannedWords)){
        msg.delete();
        msg.reply('Banned word has been detected!');
        return;
    }

    if (msg.content.indexOf(client.config.prefix) !== 0) return;

    // console.log(`Info:\n\tMessage from: ${msg.author.username}\n\tChannel: ${msg.channel.name}\n\tMessage content: ${msg.content}`);

    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);

    const commade = args.shift().toLowerCase();
    
    if (commade === 'ping') {
        msg.reply('Pong!');
        msg.channel.send('Pong...').then((message) => {
            message.edit(`Pong! Latency is ${message.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        });
    } else if (commade === 'hello') {
        msg.reply('Hello');
    } else if (msg.content.startsWith('!say, ')){
        toSay = msg.content.replace('!say,', '');
        msg.channel.send(toSay);
    } else if(commade.startsWith('metar')){
        const axios = require('axios');

        const icaoCode = msg.content.slice('metar').trim().split(/ +/g)[1].toLowerCase(); // error if I type : '!metar'
        console.log(icaoCode);

        // Make a request for a user with a given ID
        axios.get(`http://metar.vatsim.net/${icaoCode}`)
        .then(function (response) {
            console.log(response.data);
            msg.channel.send(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log('I have ave error!');
            console.log(error);
        })
        .then(function () {
            console.log('This metar is provided by VATSIM');
        });
    }
}

client.on('message', messagesEvent);

api.get('/', function(req, res){
    const channel = client.channels.find('name', 'general');
    channel.send(`Hello i'm on`);
    return;
});

api.post('/send', function (req, res) {
    console.log(req.body.message);

    // Get channel object
    const channel = client.channels.find('name', 'general');

    // Send message to the channel
    channel.send(`${req.body.message}`);

    // Send response to the client request with status 200
    res.status(200).send('message send successfully');
});
 
api.listen(3000);


client.login(client.config.token);

