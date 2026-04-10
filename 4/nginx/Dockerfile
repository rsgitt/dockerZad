FROM nginx:1.27-alpine

ARG NGINX_VERSION
LABEL version=$NGINX_VERSION

COPY nginx/mynginx.conf /etc/nginx/nginx.conf
COPY front/ /usr/share/nginx/html

EXPOSE 80