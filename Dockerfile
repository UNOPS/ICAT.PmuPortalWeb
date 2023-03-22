FROM node:16-alpine AS builder
COPY package.json package-lock.json ./
RUN npm ci -f && mkdir /app && mv ./node_modules ./app
WORKDIR /app
COPY . .
RUN npm run ng build -- --output-path=dist

FROM nginx:1.17-alpine

COPY nginx/default.conf.template /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY run.sh /

CMD ["/run.sh"]