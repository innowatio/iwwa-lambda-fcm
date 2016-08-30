[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-fcm.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-fcm)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-fcm.svg)](https://david-dm.org/innowatio/iwwa-lambda-fcm)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-fcm/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-fcm#info=devDependencies)
[![codecov.io](https://codecov.io/github/innowatio/iwwa-lambda-fcm/coverage.svg?branch=master)](https://codecov.io/github/innowatio/iwwa-lambda-fcm?branch=master)

# Lambda FCM notification

Send notification to FCM

## Deployment

This project deployment is automated with Lambdafile. For more info [`lambda-boilerplate`](https://github.com/lk-architecture/lambda-boilerplate/).

### Configuration

The following environment variables are needed to configure the function:

- `GOOGLE_SERVER_API_KEY` __string__ *required*: google server API key
- `MONGODB_URL` __string__ *required*: URL of the MongoDB endpoint
- `LOG_LEVEL` __string__ *optional*: level of the log, default to `info`
- `DEBUG` __boolean__ *optional*: set to `true` if you want more log from [`kinesis-router`](https://github.com/lk-architecture/kinesis-router/)

### Run test

In order to run tests locally a MongoDB instance and a `MONGODB_URL` environment
param are needed.
Then, just run `npm run test` command.
