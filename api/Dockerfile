FROM cgr.dev/chainguard/node
ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node ["package.json", "server.js", "./"]

RUN npm install --omit-dev

CMD [ "server.js" ]
