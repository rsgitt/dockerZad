FROM node:20-alpine

ARG IMAGE_VERSION
LABEL version=$IMAGE_VERSION

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .
# dla json zapisy
RUN mkdir -p /data && chown -R node:node /data 

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]