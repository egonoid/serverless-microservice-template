import { APIGatewayProxyResult } from 'aws-lambda';

export const handleError = (error?: string): APIGatewayProxyResult => {
  let statusCode = 0;

  switch (error) {
    case 'NOT_FOUND':
      statusCode = 404;
      break;
    default:
      statusCode = 400;
      break;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message: 'BUSINESS_ERROR',
      errors: error ? [{ type: error }] : [],
    }),
  };
};
