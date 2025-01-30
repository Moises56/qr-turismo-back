# Dockerfile para qr-turismo-back
FROM node:18-alpine

# Setea el directorio de trabajo
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente del backend
COPY . .

# Genera el build del backend
RUN npm run build

# Expone el puerto en el que correrá el backend
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
