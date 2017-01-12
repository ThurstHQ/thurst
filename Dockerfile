FROM node:boron

WORKDIR /app
COPY . .
RUN npm install --production

#RUN mkdir ~/.aws
#RUN touch ~/.aws/credentials
#RUN echo "[default]\naws_access_key_id = ${AKI}\naws_secret_access_key = ${SAK}" > ~/.aws/credentials

CMD yum install imagemagick
# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js