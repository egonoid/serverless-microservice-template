# Serverless Mircoservice Template

Based on [aws-nodejs-typescript](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript).

## Installation

```bash
git clone https://github.com/egonoid/serverless-microservice-template new-service
cd new-service
rm -r .git
git init
git add --all
git commit -m "Initial commit"
yarn
```

## Development

```bash
yarn start
```

Execute ping function

```bash
curl http://localhost:3000/ping?message=test
```

or

```bash
sls invoke local -f ping -p events/ping.json
```

## Linting & Code formatting

```bash
yarn format
```

```bash
yarn lint
```

## Debugging

VSCode debugging is configured for ping function.

## Testing

An example can be found at `src/handlers/ping/ping.test.ts`.

Single run tests:

```bash
yarn test
```

Start tests in watch mode:

```bash
yarn test:watch
```

### Mocks

- https://kalinchernev.github.io/tdd-serverless-jest/#mocking-aws-services
- https://github.com/dwyl/aws-sdk-mock
- https://github.com/serverless/event-mocks
