/**
 * Commandes
 */

module.exports = messagesEvent = (msg) => {
    console.log(`Info:\n\tMessage from: ${msg.author.username}\n\tChannel: ${msg.channel.name}`);

    if(msg.content === 'ping'){
        msg.replay('Pong!');
    }
}