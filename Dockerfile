ARG NODE_VERSION=18.0.0
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV production
WORKDIR /application
COPY . .

RUN npm install
RUN npm build
USER node

 
EXPOSE 3000
CMD ["npm", "start"]
