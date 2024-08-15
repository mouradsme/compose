ARG NODE_VERSION=18.0.0
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV production
WORKDIR /application

RUN npm install
USER node
COPY . .

 
EXPOSE 3000
CMD ["npm", "start"]
