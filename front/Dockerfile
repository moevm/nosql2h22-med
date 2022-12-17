# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /front

# add `/front/node_modules/.bin` to $PATH
ENV PATH /front/node_modules/.bin:$PATH

# install front dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# add front
COPY . ./

# start front
CMD ["npm", "start"]