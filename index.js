require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const mcping = require('mc-ping-updated')

let serverOff = "Attention Gamers! The server is now offline!";
let serverOn = "Attention Gamers! The server is now online!";

const prefix = '!';
const cmdList = ['help', 'up']


var channel

var serverOnline

let lastKnownStatus

function update() {
    mcping(process.env.url, 25565, function(err,res) {
        if(err)
        {
            serverOnline = false;
            status = ' SERVER OFFLINE '
            client.user.setStatus('dnd').catch(console.error);
            client.user.setActivity(status).then(presence => console.log(status))
            .catch(console.error);
            if(serverOnline != lastKnownStatus || lastKnownStatus == null)
            {
                check(serverOnline)
                lastKnownStatus = serverOnline
            }
            //console.log(err);
        }
        else
        {
            serverOnline = true;

            var status = ' server online '

            if(res.players.online >= res.players.max)
            {
                client.user.setStatus('idle').catch(console.error);
            }
            else
            {
                client.user.setStatus("online").catch(console.error);
            }
            if(res.players.online < res.players.max)
            {
                status = ' ' + res.players.online + ' of ' + res.players.max + ' ';
            }
            else
            {
                status = ' 0 of ' + res.players.max;
            }
            client.user.setActivity(status, {type: 'WATDCHING'})
            .then(presence => console.log(status))
            .catch(console.error);

            if(serverOnline != lastKnownStatus || lastKnownStatus == null)
            {
                check(serverOnline);
                lastKnownStatus = serverOnline;
            }
        }
    })

}

function check(bool) {
    console.log('checking status...')
    if(bool == false)
    {
        channel.send(serverOff)
        //console.log('logic says server is off')
    }
    else
    {
        channel.send(serverOn)
        //console.log('logic says server is on')
    }
}

client.on('ready', () =>{
    console.log("Online");
    channel = client.channels.get(process.env.realchannel)
    //useful for seeing all the channels.
    /*client.channels.forEach((channel)=>{
        console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
    }) */
    client.setInterval(update,30000);
})

client.on('message', (message) =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    if(message.content.startsWith(prefix + 'help')) {
        message.channel.send('Here\'s a list of all the current commands: ' + '\n' +
            '**!up** : checks if the server is currently online or not. \n' +
            '**!help** : displays this message. \n' +
            'That is all, have any suggestions, tag the server owner with them, in the \'suggestions\' channel!'
        )
    }

    if(message.content.startsWith(prefix + 'up')) {
        if(lastKnownStatus == false)
        {
            message.channel.send("Server is offline");
        }
        else
        {
            message.channel.send("Server is online");
        }
    }
})

client.login(process.env.bot_token)