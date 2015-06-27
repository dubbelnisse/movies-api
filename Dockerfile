FROM node:latest
ADD . /app
WORKDIR /app
RUN rm -rf node_modules
RUN npm install
RUN npm install -g nodemon
RUN node -v
ENV PORT 3000
EXPOSE 3000
CMD ["nodemon"]