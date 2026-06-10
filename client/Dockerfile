# Folosim aceeași imagine ușoară de Node pentru compatibilitate ARM64
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expunem portul implicit pentru Vite
EXPOSE 5173

# IMPORTANT: Pornim Vite cu flag-ul --host pentru a fi accesibil în afara containerului
CMD ["npm", "run", "dev", "--", "--host"]