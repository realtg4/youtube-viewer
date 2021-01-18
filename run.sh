if [ $# -gt 1 ]
then
    docker container stop $(docker container ls -aq)
    git reset --hard
    git pull origin master
    docker-compose build
    docker-compose up -d --scale ytview=2
else
    sh run.sh 1
fi