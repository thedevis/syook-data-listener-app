const config={
    ENV:process.env.NODE_ENV,
    app:{
        SECRET_KEY:process.env.SECRET_KEY,
        IV:process.env.IV,
        EMITTER_SERVICE:process.env.EMITTER_SERVICE_URL
    },
    mongo:{
        host:process.env.MONGO_HOST,
        port:process.env.MONGO_PORT,
        database:process.env.MONGO_DATABASE,
        username:process.env.MONGO_USERNAME,
        password:process.env.MONGO_PASSWORD
    },
    rabbitMQ:{
        connection:process.env.RABBIT_MQ_CONNECTION_STRING,
        queue:process.env.RABBIT_MQ_QUEUE
    }
}
module.exports = config;