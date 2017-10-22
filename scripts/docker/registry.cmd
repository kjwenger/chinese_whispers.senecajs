@rem docker network create "chinese_whispers"
docker rm ^
    --force ^
    "chinese_whispers.registry"
docker run ^
    --publish 8400:8400 ^
    --publish 8500:8500 ^
    --publish 8600:53/udp ^
    --hostname "consul.chinese-whispers" ^
    --name "chinese_whispers.registry" ^
    progrium/consul -server -bootstrap

@rem    --network "chinese_whispers" ^
