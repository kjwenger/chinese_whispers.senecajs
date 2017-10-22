#!/usr/bin/env bash

docker build -t "kjwenger@yahoo.com/chinese_whispers.senecajs" .
docker run -p 8910:8910 -d "kjwenger@yahoo.com/chinese_whispers.senecajs"