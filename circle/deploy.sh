#!/bin/sh

convox login console.convox.com
convox switch ${CONVOX_ORG}/${CONVOX_RACK}
convox deploy --app $CONVOX_APP --file docker-compose.deploy.yml
