FROM node:23

# Actualizar e instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libu2f-udev \
    libvulkan1 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils && \
    apt-get clean && \
    apt-get autoclean && \
    apt-get upgrade -y && \
    apt-get clean

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# Copiar el código fuente
COPY src /app/src

# Instalar dependencias y compilar por pasos para ver errores si ocurren
RUN npm install -g npm@9.6.5 typescript
RUN npm install
RUN npm run build

# Exponer puerto
# EXPOSE 3000
EXPOSE $PORT

# Comando para iniciar
# CMD [ "node", "./dist/main.js" ]
CMD ["npm", "run", "start:prod"]

