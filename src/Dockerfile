# !!!!!!!!!!!!!!!
# EDIT DOCKER CONFIGURATION TO YOUR NEEDS FOR PRODUCTION
# !!!!!!!!!!!!!!!

FROM php:8.3-apache

RUN apt update && apt upgrade -y && apt --purge autoremove -y && apt clean && \
groupadd -r myuser && useradd -r -g myuser myuser && \
cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini && \
sed -i -e "s/display_errors = On/display_errors = Off/g" /usr/local/etc/php/php.ini && \
docker-php-ext-install pdo pdo_mysql

USER myuser

COPY . /var/www/html/
