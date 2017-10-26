#!/usr/bin/env bash

export SENECA_CONSUL_REGISTRY="{\"host\": \"localhost\"}"
export SENECA_MESH_PIN="role:translator,cmd:translate,from:de,to:fr"

npm run start:yandex
