docker build -t movies-api .
docker tag -f movies-api tutum.co/dubbelnisse/movies-api
docker push tutum.co/dubbelnisse/movies-api