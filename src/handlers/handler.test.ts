import { hello } from './handler';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';
import createEvent from '@serverless/event-mocks';

describe('handler', () => {
  it('should return the passed in message', async () => {
    // Arrange
    const body = {
      body: JSON.stringify({ message: 'test' }),
    } as APIGatewayProxyEvent;
    const event = createEvent('aws:apiGateway', body);
    const context: Context = {} as Context;
    const callback = null;

    // Act
    const result = await hello(event, context, callback);

    // Assert
    expect(result).toStrictEqual({
      statusCode: 200,
      body: '{\n  "message": "test"\n}',
    });
  });
});
