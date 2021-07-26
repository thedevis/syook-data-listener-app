const config = require("./../config/config");
config.rabbitMQ.connection = "amqp://localhost";
config.rabbitMQ.queue = "message_queue";
const amqp = require("amqplib");
const connection = amqp.connect(config.rabbitMQ.connection);
const db = require("./../connections/mongoConnection");
const MessageModel = require("./../models/MessageSample");
const { socketIO } = require('./../webapp');
const {
  MessageEncodingDecodingUtil,
} = require("./../utils/MessageEncodingDecodingUtil");
connection
  .then(async (conn) => {
    const channel = await conn.createChannel();
    channel.consume(config.rabbitMQ.queue, async (m) => {
      socketIO.emit("message","Praveen");
      let { messages, event_timestamp } = JSON.parse(m.content.toString());
      let timeSeriesData = {};
      let encryptedMessages = messages.split("|");
      let timeStampInMinute = new Date(event_timestamp);
      let _seconds = timeStampInMinute.getSeconds();
      timeStampInMinute.setSeconds(0);
      timeStampInMinute.setMilliseconds(0);
      encryptedMessages.forEach((message) => {
        let decryptedMessage = MessageEncodingDecodingUtil.decrypt(message);
        decryptedMessage = JSON.parse(decryptedMessage);
        let isValidMessage =
          MessageEncodingDecodingUtil.verifySignature(decryptedMessage);
        delete decryptedMessage.secret_key;
        decryptedMessage.created_at = new Date();
        let _messageIndex = decryptedMessage.created_at.getSeconds();

        if (timeSeriesData[timeStampInMinute.getTime()]) {
          timeSeriesData[timeStampInMinute.getTime()].total_message_count++;
          if (isValidMessage) {
            timeSeriesData[timeStampInMinute.getTime()].message_data[
              _messageIndex
            ].push(decryptedMessage);
          } else {
            timeSeriesData[timeStampInMinute.getTime()].invalid_message_count++;
          }
        } else {
          timeSeriesData[timeStampInMinute.getTime()] = {
            total_message_count: isValidMessage ? 1 : 0,
            invalid_message_count: isValidMessage ? 0 : 1,
            message_data: new Array(60).fill([]),
            timestamp_minute: timeStampInMinute,
          };
          if (isValidMessage) {
            timeSeriesData[timeStampInMinute.getTime()].message_data.splice(
              _messageIndex,
              0,
              [decryptedMessage]
            );
          }
        }
      });

      let minuteWiseDateMap = Object.keys(timeSeriesData).sort();
      for(let time of minuteWiseDateMap){
        let collection = timeSeriesData[time];
        let timeSeriesDocument = await MessageModel.findOne({
          timestamp_minute: new Date(collection.timestamp_minute),
        });
        if (!timeSeriesDocument) {
          timeSeriesDocument = new MessageModel();
        }
        if(timeSeriesDocument.isNew){
          timeSeriesDocument.timestamp_minute  =  collection.timestamp_minute;
          timeSeriesDocument.total_message_count=collection.total_message_count
          timeSeriesDocument.invalid_message_count=collection.invalid_message_count
          timeSeriesDocument.message_data=collection.message_data;
          let _res = await timeSeriesDocument.save();
          console.log(_res.id);
        } else {

          let updatedRecord={}
          updatedRecord.total_message_count= timeSeriesDocument.total_message_count+collection.total_message_count;
          updatedRecord.invalid_message_count= timeSeriesDocument.invalid_message_count+collection.invalid_message_count;
          updatedRecord.message_data = Array.from(timeSeriesDocument.message_data);

          for(let i=0;i<collection.message_data.length;i++){
            if(collection.message_data[i].length){
              //console.log(updatedRecord.message_data[i].length);
              [].push.apply(updatedRecord.message_data[i], collection.message_data[i]);
              //console.log(updatedRecord.message_data[i].length);
            }
          }
          let result = await MessageModel.updateOne({_id:timeSeriesDocument._id},updatedRecord);
          console.log(result);

          //await timeSeriesDocument.updateOne({});
        }

        console.log(time);

      }
      channel.ack(m);
    });
  })
  .catch(console.error);
