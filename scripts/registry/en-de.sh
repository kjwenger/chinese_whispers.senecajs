#!/usr/bin/env bash

export SENECA_CONSUL_REGISTRY="{\"host\": \"localhost\"}"
export SENECA_MESH_PIN="role:translator,cmd:translate,from:en,to:de"
#export SENECA_MESH_PINS="[{\"role\": \"translator\", \"from\": \"en\", \"to\": \"de\"}]"

npm run start:google
#npm run start:service