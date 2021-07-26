var mongoose = require("mongoose");
var config = require("./../config/config");
config.mongo.host = '127.0.0.1';
config.mongo.port = 27017;
config.mongo.database = 'syook';
const CONNECTION_STRING = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?readPreference=secondaryPreferred`;
var connectMongoose = function () {
  mongoose.connect(CONNECTION_STRING, {
    poolSize: 500,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
};
connectMongoose();
mongoose.connection.on("error", function (err) {
  console.log(err);
});

mongoose.connection.on("open", function () {
    console.log('mongo db connected');
  //helper.importAllModels();

});

// Reconnect when closed
mongoose.connection.on("disconnected", function () {
//   setTimeout(function () {
//     connectMongoose();
//   }, 1000);
});
module.exports = mongoose;
