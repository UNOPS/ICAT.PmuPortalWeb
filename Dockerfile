# STEP 1 building your app
FROM node:alpine as builder
RUN apk update && apk add --no-cache make git
# a) Create app directory
WORKDIR /app
# b) Create app/nginx directory and copy default.conf to it
WORKDIR /app/nginx
COPY nginx/default.conf.template /app/nginx/
# c) Install app dependencies
COPY package.json package-lock.json /app/
RUN cd /app && npm set progress=false && npm install -f
# d) Copy project files into the docker image and build your app
COPY .  /app
RUN cd /app && npm run ng build --prod --output-path=dist
# STEP 2 build a small nginx image
FROM nginx:alpine
# a) Remove default nginx code
RUN rm -rf /usr/share/nginx/html/*
# b) From 'builder' copy your site to default nginx public folder
COPY --from=builder /app/dist/icat.pmuportalweb /usr/share/nginx/html
# c) copy your own default nginx configuration to the conf folder
RUN rm -rf /etc/nginx/default.conf.template
COPY --from=builder /app/nginx/default.conf.template /etc/nginx/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]