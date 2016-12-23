FROM node:argon

WORKDIR /app
COPY . .
RUN npm install --production

CMD yum install imagemagick
# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js