#!/usr/bin/env bash

export SENECA_MESH_BASES="[\"localhost\"]"
export SENECA_MESH_PIN="role:conductor,cmd:convey"

npm run start:conductor
