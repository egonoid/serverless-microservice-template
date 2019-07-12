import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const ping: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const body = event.queryStringParameters;
  const message = body && body.message ? body.message : 'pong';

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message,
      },
      null,
      2
    ),
  };
};

export default ping;
