FROM node:20-alpine

# katalog roboczy
WORKDIR /app

# kopiowanie zaleznosci
COPY package*.json ./ 
RUN npm ci --omit=dev

# kopiowanie kodu zrodlowego (js)
COPY src/ ./src/ 

# wystawienie na port 3000 
EXPOSE 3000 

# uruchomienie jako user (brak dostepu do kernel)
USER node 

CMD ["node", "src/server.js"]