#!/usr/bin/env bash

export SENECA_CONSUL_REGISTRY="{\"host\": \"localhost\"}"
export SENECA_MESH_ISBASE=1
export SENECA_MESH_PORT=39002

npm run start:base