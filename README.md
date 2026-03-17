# weatherApp - DataOps

## Description

## Installation

- Clone this repo
- On your terminal
    -  `cd` to root folder
    - `npm i` to install dependencies
    - setup `.env` with:
        - `PORT` of your choosing
        - `CITY` of your choosing
        - `API_KEY` from open weather
    - delete data folder to start your own
    - `node fetchWeather.js` to create/update data folder
    - `node app.js` to start server
- Open browser on `PORT` to see weather and graph

## Using Docker

- Open your Docker Desktop
- Make sure you are on the same path as Dockerfile
- On your terminal run:
    - `docker build -t <app-name>:<tag> .` or `docker build -t weatherapp . `to build an image based on the Dockerfile
    - `docker run -p <local-port>:<container-port> <image-name>` or `docker run -p 3000:5000 weatherapp` to run a container based on an image

## Tests

We have tests to check if files inside the data folder are correct 


