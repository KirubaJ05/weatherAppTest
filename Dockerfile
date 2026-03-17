FROM node:22-slim 
# pre existing container on dockerhub to install node
WORKDIR /app 
#sets up as a working director within the container
# create an /app folder 
COPY package*.json ./ 
#copy anything that has package at the start of the name to install dependencies before copying the rest of the code
RUN npm ci
#installs apps exactly as listed on package.json for clean reproduceable code
#uses ci instead of i does a clean install which means remove everything that exists and reinstalls. used for automated environment.
#ensures you start from the same point
COPY . . 
#copy all project files and folder into the container
ENV PORT=5000
#sets port to run container on
CMD ["node","app.js"]
#defines the commands to start the app when the container runs 


