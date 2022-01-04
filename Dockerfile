FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

COPY . .

RUN npm install

CMD [ "npm", "start" ]

##FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/configfile.template


#ENV PORT 8080
#ENV HOST 0.0.0.0
#EXPOSE 8080

#CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
