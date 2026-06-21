# # Folosim aceeași imagine ușoară de Node pentru compatibilitate ARM64
# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# # Expunem portul implicit pentru Vite
# EXPOSE 5173

# # IMPORTANT: Pornim Vite cu flag-ul --host pentru a fi accesibil în afara containerului
# CMD ["npm", "run", "dev", "--", "--host"]

# 1. Imaginea de bază
FROM node:20-alpine

# 2. Setăm directorul de lucru
WORKDIR /app

# 3. Copiem fișierele de dependințe și instalăm
COPY package*.json ./
RUN npm install

# 4. Copiem restul codului (necesar dacă nu vrei să te bazezi DOAR pe volume)
COPY . .

# 5. Expunem portul
EXPOSE 5173

# 6. COMENZILE DE START (Aici era problema ta)
# Trebuie să îi spui containerului ce să ruleze pentru a rămâne deschis
CMD ["npm", "run", "dev", "--", "--host"]