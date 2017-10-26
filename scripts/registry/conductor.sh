#!/usr/bin/env bash

export SENECA_CONSUL_REGISTRY="{\"host\": \"localhost\"}"
export SENECA_MESH_PIN="role:conductor,cmd:convey"

npm run start:conductor
