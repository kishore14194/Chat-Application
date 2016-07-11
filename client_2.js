var amqp = require('amqplib/callback_api');
var prompt = require('prompt');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {

    prompt.start();

    var send_q = 'q1';
    var receive_q = 'q2';

    ch.assertQueue(receive_q, {durable: false});

    console.log("Waiting for messages in %s. ", receive_q);

    ch.consume(receive_q, function(msg) {
      if (msg.content.toString() == 'end'){
        prompt.get(['t'], function(err, result){
          ch.sendToQueue(send_q, new Buffer(result.t));
          console.log("Sent %s",result.t);
          });
      }
      else {
        console.log(" Received %s", msg.content.toString());
        // prompt.get(['u'], function(err, result){
        //   ch.sendToQueue(send_q, new Buffer(result.u));
        //   console.log("Sent %s",result.u);
          });
      }

    }, {noAck: true});
  });
});
