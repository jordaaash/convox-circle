#!/bin/sh

cat /dev/null > start.log
printenv > .env
convox start --file docker-compose.circle.yml --sync=false
