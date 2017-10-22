docker build ^
    --tag "kjwenger/chinese_whispers.senecajs" ^
    --network "chinese_whispers" ^
    .
docker run ^
    --detach ^
    --network "chinese_whispers" ^
    --name "chinese_whispers.senecajs" ^
    --publish 8910:8910 ^
    "kjwenger/chinese_whispers.senecajs"