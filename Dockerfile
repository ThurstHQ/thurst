FROM node:boron

WORKDIR /app
COPY . .
RUN npm install --production

RUN mkdir /app/public
VOLUME ["/var/lib/docker/volumes/dd90d70ac2d6276ae6c108779567f3076234cc97b2e8c71e866ca0e719815b13/_data:/app/public:rw"]

CMD yum install imagemagick
# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js