import 'reflect-metadata';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';
import { IPingService } from '@application/services/interfaces/ping.service';
import * as Types from '@common/dependency-injection/types';
import container from '@common/dependency-injection/container';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { eventLogger } from '@egonoid/api-middlewares';
import { v4 as uuid } from 'uuid';

export const ping: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = event.queryStringParameters;
  const message = body?.message;
  const pingService = container.get<IPingService>(Types.PingService);
  const result = pingService.ping(message);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
      uuid: uuid(),
    }),
  };
};

export default middy(ping).use(eventLogger()).use(cors());
