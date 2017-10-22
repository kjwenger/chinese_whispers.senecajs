@rem docker network create "chinese_whispers"
docker rm ^
    --force ^
    "chinese_whispers.base"
docker build ^
    --file "docker/base/Dockerfile" ^
    --tag "kjwenger/chinese_whispers.senecajs" ^
    .
docker run ^
    --env SENECA_CONSUL_REGISTRY="consul.chinese-whispers" ^
    --name "chinese_whispers.base" ^
    --rm ^
    "kjwenger/chinese_whispers.senecajs"

@rem    --network "chinese_whispers" ^
