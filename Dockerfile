FROM node:12.14.0-alpine3.9

RUN mkdir /home/code

COPY . /home/code

WORKDIR /home/code

RUN npm install --production && rm -rf /var/cache/apk/*

ENV NODE_ENV=production

EXPOSE 3010

ENTRYPOINT [ "node", "/home/code/app.js" ]
#docker build .
#docker run --env-file=.test-env <imageid/image name>
