#!/bin/bash
rm -rf build
PUBLIC_URL=/card/ yarn build
rm -rf /home/syscc/docker/nginx/www/card
cp -rf ./build /home/syscc/docker/nginx/www/card
