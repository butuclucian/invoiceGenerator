# Folosim o imagine oficială de Node.js optimizată pentru ARM64
FROM node:20-alpine

# Setăm folderul de lucru în container
WORKDIR /app

# Copiem fișierele de dependințe
COPY package*.json ./

# Instalăm modulele npm în interiorul containerului
RUN npm install

# Copiem restul codului sursă al backend-ului
COPY . .

# Expunem portul pe care ascultă serverul tău Node
EXPOSE 8000

# Comanda de pornire a backend-ului
CMD ["npm", "start"]