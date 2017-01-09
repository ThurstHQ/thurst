FROM node:boron

WORKDIR /app
COPY . .
RUN npm install --production

#VOLUME ["/app/public/images"]
CMD docker run -it --name vol-test -h CONTAINER -v /data ubuntu /bin/bash
CMD yum install imagemagick
# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js