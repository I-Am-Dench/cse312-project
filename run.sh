if [[ $1 == "prod" ]]; then
    docker compose -f docker-compose.prod.yml up --build
else
    docker compose up --build
fi