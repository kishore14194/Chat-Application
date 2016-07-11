var amqp = require('amqplib/callback_api');
var prompt = require('prompt');


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function sender(err, ch) {
    prompt.start();
    var send_q = 'q2';
    var receive_q = 'q1';

    var msg = prompt.get(['t'], function(err, result) {
      if (err) { return onErr(err); }

      ch.sendToQueue(send_q, new Buffer(result.t));
      console.log("Sent the message - %s",result.t);
      ch.assertQueue(send_q, {durable: false});
      sender(err,ch);
    });

    ch.assertQueue(receive_q, {durable: false});

    ch.consume(receive_q, function(msg) {
      console.log(" Received %s", msg.content.toString());


      prompt.get(['u'], function(err, result) {
        ch.sendToQueue(send_q, new Buffer(result.u));
        console.log("Sent the meessaaggee - %s",result.u);
      });
    }, {noAck: true});
  });
});
