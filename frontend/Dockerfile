FROM node:24-alpine@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN chmod +x ./scripts/dev-entrypoint.sh

EXPOSE 5173

CMD ["sh", "./scripts/dev-entrypoint.sh"]
