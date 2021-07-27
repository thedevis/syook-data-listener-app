const config = require('./config/config')
var app = require("express")();
var http = require("http").Server(app);

http.listen(config.app.PORT, function () {
  console.log(`Server is running on ${config.app.PORT}`);
});
module.exports={
    app:app,
    socketIO:require("socket.io")(http)

}
