# Syook Message Decoder Service

## Requirement  
1. RabbitMQ (there should be one queue available in your rabbitMq to store upcoming message)
2. Mongodb
3. Docker(optional)
4. Emitter Service connection end point

## Run service using Docker
1. Docker build . -t syook/decoder
2. docker run -it -p 3010:3010 --env-file=.test.env syook/decoder

## Run withour docker
1. npm install
2. cp .test.env .env
3. npm start


### Application
> open http://localhost:3010
