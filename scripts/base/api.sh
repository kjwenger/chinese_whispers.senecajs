#!/usr/bin/env bash

export PORT=8765
export SENECA_CONSUL_REGISTRY="{\"host\": \"localhost\"}"
export SENECA_MESH_BASES="[\"localhost\"]"

npm run start:api