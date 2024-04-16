FROM php:8.3-apache

RUN apt update && apt upgrade -y && apt --purge autoremove -y && apt clean
RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini && \
sed -i -e "s/display_errors = On/display_errors = Off/g" /usr/local/etc/php/php.ini
RUN docker-php-ext-install pdo pdo_mysql

COPY . /var/www/html/
