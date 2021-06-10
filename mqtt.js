var mqtt = require('mqtt');
var options = {
    port: 16445,
    host: 'mqtt://	hairdresser.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'arjmjjfy',
    password: 'sNcPRnpGe9F0',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt:hairdresser.cloudmqtt.com', options);
client.on('connect', function() { // When connected
    console.log('connected');
    //subscribe to a topic
    // client.subscribe('test/#', function() {
    //     // when a message arrives, do something with it
    //     client.on('message', function(topic, message, packet) {
    //         console.log( message +' : on topic :: ' + topic );
    //     });
    // });

    //publish a message to a topic
    setInterval(function(){client.publish('test', 'Hello mqtt')},1000)
});