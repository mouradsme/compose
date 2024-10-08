ARG NODE_VERSION=18.0.0
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV production
ENV NEXT_PUBLIC_BACKEND_URL "http://test.backend.siinedz.com/api"
ENV NEXT_PUBLIC_ITEMS_PER_PAGE 25
WORKDIR /application
COPY . .

RUN npm install
RUN npm install @types/react @types/react-dom @types/react-router-dom --save-dev
RUN npm i --save-dev @types/react-google-recaptcha 
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

