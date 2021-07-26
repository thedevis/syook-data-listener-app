const config = require("./../config/config");
config.rabbitMQ.connection = "amqp://localhost";
config.rabbitMQ.queue = "message_queue";
const amqp = require("amqplib");
const connection = amqp.connect(config.rabbitMQ.connection);
const db = require("./../connections/mongoConnection");
const MessageModel = require("./../models/MessageSample");
const Test = require("./../models/Test");
const {
  MessageEncodingDecodingUtil,
} = require("./../utils/MessageEncodingDecodingUtil");
connection
  .then(async (conn) => {
    const channel = await conn.createChannel();
    channel.consume(config.rabbitMQ.queue, async (m) => {
      let { messages, event_timestamp} = JSON.parse(m.content.toString());
      let timeSeriesData = {};
      let encryptedMessages = messages.split("|");
      let timeStampInMinute = new Date(event_timestamp);
      let _seconds=timeStampInMinute.getSeconds();
      timeStampInMinute.setSeconds(0);
      
      encryptedMessages.forEach(message => {
        let decryptedMessage = MessageEncodingDecodingUtil.decrypt(message);
        decryptedMessage = JSON.parse(decryptedMessage);
        let isValidMessage = MessageEncodingDecodingUtil.verifySignature(decryptedMessage);
        delete decryptedMessage.secret_key;
        decryptedMessage.created_at=new Date();
        let _messageIndex=decryptedMessage.created_at.getSeconds();

        if(timeSeriesData[timeStampInMinute.getTime()]){
            timeSeriesData[timeStampInMinute.getTime()].total_message_count++;
            if(isValidMessage){
                timeSeriesData[timeStampInMinute.getTime()].message_data[_messageIndex].push(decryptedMessage);
            } else {
                timeSeriesData[timeStampInMinute.getTime()].invalid_message_count++;
            }
        } else {
            timeSeriesData[timeStampInMinute.getTime()]={
                total_message_count:isValidMessage ? 1 : 0,
                invalid_message_count:isValidMessage ? 0 : 1,
                message_data:new Array(60).fill([]),
                timestamp_minute:timeStampInMinute
            }
            if(isValidMessage){
                timeSeriesData[timeStampInMinute.getTime()].message_data.splice(_messageIndex,0,[decryptedMessage]);
            }
        }
      });
      for(let message in timeSeriesData){
        let messageModel = await Test.find({timestamp_minute:timeSeriesData[message].timestamp_minute});
        if(messageModel.length){

        } else {
            let messageModel= new Test(timeSeriesData[message]);
            await messageModel.save();
        }
      }
      
      //console.log(timeSeriesData);
      channel.ack(m);
    });
  })
  .catch(console.error);
