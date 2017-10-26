#!/usr/bin/env bash

export SENECA_MESH_BASES="[\"localhost\"]"
export SENECA_MESH_PIN="role:translator,cmd:translate,from:en,to:de"

npm run start:google
