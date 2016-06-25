#!/bin/sh

TAIL="tail -n 1000 -f start.log"
eval $TAIL | \
while read LINE
do
  echo $LINE
  echo $LINE | grep -q "HTTP server listening at port $PORT" && pkill -f "$TAIL"
done
