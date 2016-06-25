#!/bin/sh

export APP_CONTAINER=$(docker inspect --format "{{.Id}}" ${CONVOX_APP}-app)
export $(docker inspect --format "{{json .Config.Env}}" ${CONVOX_APP}-app | jq -r 'join(" ")')
