import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { IPingService } from '../../lib/application/interfaces/ping.service';
import * as Types from '../../lib/common/dependency-injection/types';
import container from '../../lib/common/dependency-injection/container';

export const ping: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const body = event.queryStringParameters;
  const message = body && body.message ? body.message : 'pong';

  const pingService = container.get<IPingService>(Types.PingService);
  const result = pingService.ping(message);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: result,
      },
      null,
      2
    ),
  };
};

export default ping;
