# baza obrazu
FROM nginx:1.27-alpine 

# skopiowanie wlasnej konfiguracji reverse proxy (zmienic adres pliku mojej konfiguracji)
COPY nginx/mynginx.conf /etc/nginx/nginx.conf

COPY front/ /usr/share/nginx/html

# wystawienie portu 80
EXPOSE 80 
