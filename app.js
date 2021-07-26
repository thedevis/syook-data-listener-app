const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '.env') })
const config = require('./config/config');
const io = require("socket.io-client");
const { ListenerService } = require("./services/ListenerService");
const listerService = new ListenerService()
let socket = io(config.app.EMITTER_SERVICE);
require('./services/MessageConsumer');
socket.on("message", (data) => {
   listerService.processMessage(data);
});
socket.on("connect",()=>{
   console.log('connected with server');

})
socket.on("error",(err)=>{
   console.log('Error');
})
socket.on("end",()=>{
   console.log("end event");
})
socket.on("disconnect",()=>{
   console.log("end event");
})
