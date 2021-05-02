# Getting Started with Moogie Match
![moogiematches website](https://s3.us-east-2.amazonaws.com/joshuabell.webiste/Screen+Shot+2021-05-02+at+8.12.30+PM.png)

A simple movie matching app built with Node.js, React and deployed using Amazon Web Services, running in Docker containers in AWS Fargate.

Features:

* No EC2 instances. One of the goals of this application architecture is that it is very hands off, nothing to manage or update.
* Fully defined as infrastructure as code, using AWS CloudFormation to create all the application resources.
* CI/CD Pipeline using AWS CodePipeline, so that you can just push to the Github and it will automatically deploy.
* Automated Docker container builds using AWS CodeBuild
You can view a running copy of this app, deployed on AWS at: [Links](https://moogiematches.com)

# Run it locally
To run the application on your local machine you need:

* docker
* docker-compose
* make

Execute the following command:

`make run`

The application will be available at `http://localhost:5000`

If you make changes to the code, you can run:

`make build`
This updates the client application.
