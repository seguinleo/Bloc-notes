# !!!!!!!!!!!!!!!
# EDIT DOCKER CONFIGURATION TO YOUR NEEDS FOR PRODUCTION
# !!!!!!!!!!!!!!!

FROM node:22 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM php:8.3-apache

RUN apt update && apt upgrade -y && apt --purge autoremove -y && apt clean && \
    groupadd -r myuser && useradd -r -g myuser myuser && \
    cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini && \
    sed -i -e "s/display_errors = On/display_errors = Off/g" /usr/local/etc/php/php.ini && \
    docker-php-ext-install pdo pdo_mysql

USER myuser

COPY --from=build-stage /app/dist /var/www/html
COPY --chown=myuser:myuser api /var/www/html/api

EXPOSE 80
