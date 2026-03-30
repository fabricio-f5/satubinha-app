FROM cgr.dev/chainguard/node
ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node ["package.json", "./"]
COPY --chown=node:node src/ ./src/

RUN npm install --omit-dev

USER node

CMD [ "src/index.js" ]
