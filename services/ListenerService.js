const EventEmitter = require("events");
const {
  MessageEncodingDecodingUtil,
} = require("../utils/MessageEncodingDecodingUtil");
let  messageQueue = require('./MessageService');
const MessageModel = require('./../models/MessageSample');
messageQueue = new messageQueue()
class ListenerService extends EventEmitter {
  constructor() {
    super();
    this.processedData=[];
  }
  processMessage(data){
    let encryptedMessages = data.split("|");
    messageQueue.enqueue(JSON.stringify({messages:data,event_timestamp:new Date()}))
  }
}

module.exports = { ListenerService };
