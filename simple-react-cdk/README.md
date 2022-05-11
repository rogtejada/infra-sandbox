# react-app-cdk-deployment
This is an example on how deploy a react app to AWS using CDK.
Here we will setup a react application, deploy to an AWS S3 bucket and serve it through CloudFront.

Requirements:
 - Node.js
 - CDK
 - AWS CLI

# Setup
First, setup you aws environment running:

```
    aws configure
```
You should set up your User Access Key / Secret and region.

# Deploying
In the first time you should run:
```
    cdk bootstrap # You only have to run it once
```   

Then, you need to build your react app on `app` folder, running:

```
    npm run build
```

After building the app, build and compile the TS infra component on `infra` folder, running:
```
    npm run build
```   

To deploy the app run (on `infra` folder):
```
    cdk deploy --require-approval never
```

The app bundles will be deployed to an s3 bucket. This app will be served by CloudFront. A domain will be created (you can get it from AWS console - Cloud front page) in the following format: `xxxxxxx.cloudfront.net`

To destroy the stack, run:

```
    cdk destroy
```