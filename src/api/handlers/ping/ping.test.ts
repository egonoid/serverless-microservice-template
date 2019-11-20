import ping from './ping';
import { Context } from 'aws-lambda';
import createEvent from '@serverless/event-mocks';

describe('handler', () => {
  it('should return the "pong" when no message is passed in', async () => {
    // Arrange
    const data = {};
    const event = createEvent('aws:apiGateway', data as any);
    const context: Context = {} as Context;
    const callback = null;

    // Act
    const result = await ping(event, context, callback);

    // Assert
    expect(result).toMatchSnapshot();
  });

  it('should return the passed in message', async () => {
    // Arrange
    const data = {
      body: null,
      queryStringParameters: { message: 'test' },
    };
    const event = createEvent('aws:apiGateway', data as any);
    const context: Context = {} as Context;
    const callback = null;

    // Act
    const result = await ping(event, context, callback);

    // Assert
    expect(result).toMatchSnapshot();
  });
});
