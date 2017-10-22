#!/usr/bin/env bash

docker build -t "kjwenger/chinese_whispers.senecajs" .
docker run -p 8910:8910 -d "kjwenger/chinese_whispers.senecajs"