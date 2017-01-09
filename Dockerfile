FROM node:boron

WORKDIR /app
COPY . .
RUN npm install --production

RUN mkdir /app/public
VOLUME ["/app/public"]

CMD yum install imagemagick
# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js