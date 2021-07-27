const config={
    ENV:process.env.NODE_ENV,
    app:{
        SECRET_KEY:process.env.SECRET_KEY,
        IV:process.env.IV,
        EMITTER_SERVICE:process.env.EMITTER_SERVICE_URL,
        PORT:process.env.PORT
    },
    mongo:{
        connection:process.env.MONGO_CONNECTION_STRING
    },
    rabbitMQ:{
        connection:process.env.RABBIT_MQ_CONNECTION_STRING,
        queue:process.env.RABBIT_MQ_QUEUE
    }
}
module.exports = config;