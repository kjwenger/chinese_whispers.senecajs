#!/usr/bin/env bash

export SENECA_MESH_BASES="[\"localhost\"]"
export SENECA_MESH_PIN="role:translator,cmd:translate,from:de,to:fr"

npm run start:yandex
