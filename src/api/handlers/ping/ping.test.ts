import ping from './ping';
import { Context } from 'aws-lambda';
import createEvent from '@serverless/event-mocks';
import { IPingService } from '../../../application/services/interfaces/ping.service';
import * as Types from '../../../common/dependency-injection/types';
import container from '../../../common/dependency-injection/container';
import PingService from '../../../application/services/ping.service';

describe('handler', () => {
  beforeAll(() => {
    const PingServiceMock = jest.fn<PingService, any>(() => ({
      ping: jest.fn().mockReturnValue('pong'),
    }));
    container
      .rebind<IPingService>(Types.PingService)
      .toConstantValue(new PingServiceMock());
  });

  it('should run without error', async () => {
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
});
