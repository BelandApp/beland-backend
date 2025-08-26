FROM node:23

# update and install dependencies
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
    apt-get update && apt-get upgrade -y && apt-get clean

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# copy source code to /app/src folder
COPY src /app/src

# install app dependencies & build
RUN npm install -g npm@9.6.5 typescript && \
    npm install -s && \
    npm run build


# port
EXPOSE 3000

# start command
CMD [ "node", "./dist/main.js" ]
