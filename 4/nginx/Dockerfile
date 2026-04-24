# build
FROM alpine:3.20 AS builder
WORKDIR /app
COPY front/ .

# prod
FROM nginx:1.27-alpine 

ARG NGINX_VERSION
LABEL version=$NGINX_VERSION

COPY nginx/mynginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app /usr/share/nginx/html

EXPOSE 80