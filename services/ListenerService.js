const EventEmitter = require("events");
const {
  MessageEncodingDecodingUtil,
} = require("../utils/MessageEncodingDecodingUtil");
let  messageQueue = require('./MessageService');
const MessageModel = require('./../models/MessageSample');
messageQueue = new messageQueue()

//let database = require('./../connections/mongo-con');
class ListenerService extends EventEmitter {
  constructor() {
    super();
    this.processedData=[];
  }
  processMessage(data){
    let encryptedMessages = data.split("|");
    messageQueue.enqueue(JSON.stringify({messages:data,event_timestamp:new Date()}))


    encryptedMessages.forEach(message => {
      //let _message = MessageEncodingDecodingUtil.decrypt(message);
      //let originalMessage = JSON.parse(_message);
      //originalMessage.created_at = new Date();
    });
  }
}

module.exports = { ListenerService };
