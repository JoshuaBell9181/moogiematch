FROM node:current-alpine3.10 AS build
WORKDIR /srv
ADD package.json yarn.lock ./
RUN yarn
ADD . .
RUN yarn run build

FROM node:current-alpine3.10 
COPY --from=build /srv .
EXPOSE 5000
CMD ["yarn", "run", "start-prod"]

# Authenticate to ECR
# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 382942022480.dkr.ecr.us-east-1.amazonaws.com

# RUN LOCALLY
# docker build -t moogie .  
# docker run -it -p 5000:5000 moogie

# DOCKER PUSH TO REPO
# docker tag moogie:latest 382942022480.dkr.ecr.us-east-1.amazonaws.com/moogie:v1
# docker push 382942022480.dkr.ecr.us-east-1.amazonaws.com/moogie:v1