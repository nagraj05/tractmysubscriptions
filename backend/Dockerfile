FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Explicitly install chromium just in case
RUN npx playwright install chromium

EXPOSE 3001

CMD ["npm", "start"]
