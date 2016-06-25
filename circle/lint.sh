#!/bin/sh

. ./circle/export-docker-env.sh
sudo --preserve-env lxc-attach -n "$APP_CONTAINER" --keep-env -- sh -c "cd /usr/src/app && npm run lint"
