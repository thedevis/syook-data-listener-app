class MessageQueueService {
    constructor(queueName) {
      const config = require("./../config/config");
      var amqp = require("amqplib");
      this.QUEUE_NAME = "message_queue";
      this.EXCHANGE_TYPE = "direct";
      this.EXCHANGE_NAME = "main";
      this.KEY = "myKey";
      this.number = "5";
      const connection = amqp.connect("amqp://localhost");
      this.channel;
      connection.then(async (conn) => {
        this.channel = await conn.createChannel();
        await this.channel.assertExchange(this.EXCHANGE_NAME, this.EXCHANGE_TYPE);
        await this.channel.assertQueue(this.QUEUE_NAME);
        this.channel.bindQueue(this.QUEUE_NAME, this.EXCHANGE_NAME, this.KEY);
      });
    }
    enqueue(message){
      this.channel.sendToQueue(this.QUEUE_NAME, Buffer.from(message), {
          persistent: true,
        });  
    }
    
}
  module.exports = MessageQueueService;
  

  