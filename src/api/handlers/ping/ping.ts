import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { IPingService } from '../../../application/services/interfaces/ping.service';
import * as Types from '../../../common/dependency-injection/types';
import container from '../../../common/dependency-injection/container';
import middy from 'middy';
import eventLogger from '../../middlewares/eventLogger.middleware';

export const ping: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const body = event.queryStringParameters;
  const message = body && body.message;
  const pingService = container.get<IPingService>(Types.PingService);
  const result = pingService.ping(message);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
    }),
  };
};

export default middy(ping).use(eventLogger());
