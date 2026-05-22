FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install
COPY . .
RUN npm run build -w @rpg-gym/shared && npm run build -w @rpg-gym/api
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/api/prisma/schema.prisma && npm run start -w @rpg-gym/api"]
