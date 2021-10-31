FROM node:17-alpine
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN  npm install;
    
COPY . ./
RUN chown -R node /app
USER node
CMD ["npm","run","dev"]
