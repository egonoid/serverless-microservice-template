# Serverless Mircoservice Template

Based on [aws-nodejs-typescript](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript).

## How to create a new microservice with this template

```bash
sls create --template https://github.com/egonoid/serverless-microservice-template
```

## Run hello function

```bash
sls invoke local -f hello -p events/hello.json
```

## Linting

```bash
yarn format
```

```bash
yarn lint
```
