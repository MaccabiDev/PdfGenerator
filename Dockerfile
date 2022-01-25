FROM nexusrepo:8082/node:12.17.0
#FROM node:latest
RUN mkdir -p /app
COPY package.json /app

#RUN echo "deb [trusted=yes] http://nexusrepo:8081/repository/APT_Xenial_proxy/ xenial main" > /etc/apt/sources.list
RUN echo "deb http://il.archive.ubuntu.com/ubuntu/" > /etc/apt/sources.list
RUN apt-get update && apt-get install apt-transport-https -y --allow-unauthenticated
#RUN apt-get upgrade libnss3* -y --allow-unauthenticated
#--allow-insecure-repositories
#RUN apt install bzip2 libfontconfig -y --allow-unauthenticated
#RUN apt install libatk-bridge2.0-0 -y --allow-unauthenticated
#RUN apt install libdrm2 -y --allow-unauthenticated
#wget https://rpmfind.net/linux/mageia/distrib/cauldron/aarch64/media/core/release/lib64nss3-3.74.0-1.mga9.aarch64.rpm

RUN apt-get install -y --allow-unauthenticated \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libasound2 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libfontconfig1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libicu-dev \
    libjpeg-dev \
    libnss3 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpng-dev \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils



ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN ln -fs /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app
COPY PhantomJS/phantomjs /usr/bin/
RUN chmod u+x /usr/bin/phantomjs
RUN npm config set registry http://nexusrepo:8081/repository/npm-group/ && \
    npm set strict-ssl false && \
    npm i --unsafe-perm
RUN rm -rf node_modules/phantomjs-prebuilt
RUN npm install phantomjs-prebuilt@2.1.13

RUN npm config set registry http://nexusrepo:8081/repository/npm-group/ && \
    npm set strict-ssl false && \
    npm i puppeteer    
COPY . /app/
EXPOSE 4000
CMD ["node", "pdfApi"]