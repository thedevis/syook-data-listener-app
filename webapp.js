var app = require("express")();
var http = require("http").Server(app);

http.listen(3001, function () {
  console.log("listening on *:3001");
});
module.exports={
    app:app,
    socketIO:require("socket.io")(http)

}
