FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm install
COPY . .
RUN npm run build -w @rpg-gym/shared
EXPOSE 5173
CMD ["npm", "run", "dev", "-w", "@rpg-gym/web"]
