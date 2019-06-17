import hello from './hello';
import { Context } from 'aws-lambda';
import createEvent from '@serverless/event-mocks';

describe('handler', () => {
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
    const result = await hello(event, context, callback);

    // Assert
    expect(result).toMatchSnapshot();
  });
});
