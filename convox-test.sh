#!/bin/sh

cat /dev/null > convox.log

export $(cat .env | xargs)

CONVOX="convox start --file docker-compose.yml --sync=false 2>&1 | tee convox.log"
eval $CONVOX &

TAIL="tail -n 1000 -f convox.log"
eval $TAIL | \
while read LINE
do
  echo $LINE
  echo $LINE | grep -q "HTTP server listening at port $PORT" && pkill -f "$TAIL"
done

APP_CONTAINER=$(docker inspect --format "{{.Id}}" ${CONVOX_APP}-app)
docker exec "$APP_CONTAINER" sh -c "cd /usr/src/app && npm run lint && npm test"
STATUS=$?

echo 'Stopping docker app container'
docker stop $APP_CONTAINER

echo 'Stopping convox'
pkill -f "$CONVOX"
exit $STATUS
