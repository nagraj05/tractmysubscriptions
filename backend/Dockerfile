FROM mcr.microsoft.com/playwright:v1.50.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Explicitly install chromium just in case
RUN npx playwright install chromium

EXPOSE 3001

CMD ["npm", "start"]
