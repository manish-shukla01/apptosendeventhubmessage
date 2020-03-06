FROM node
WORKDIR /
COPY package*.json ./

RUN npm install
# Bundle app source
COPY . .
CMD node ./sendmessages.js