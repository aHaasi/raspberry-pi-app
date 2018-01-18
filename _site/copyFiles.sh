#!/bin/bash
sudo rm -r /var/www/html/raspberry-app/ 
sudo cp -R _site /var/www/html 
sudo mv /var/www/html/_site/ /var/www/html/raspberry-app
