docker container stop $(docker container ls -aq)
git reset --hard
git pull origin master
docker-compose build
docker-compose up -d