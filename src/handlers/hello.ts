import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const body = event.queryStringParameters;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: body.message,
      },
      null,
      2
    ),
  };
};

export default hello;
