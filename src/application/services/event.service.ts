import { injectable, inject } from 'inversify';
import { IEventService } from './interfaces/event.service';
import { SNS } from 'aws-sdk';

@injectable()
export default class EventService implements IEventService {
  constructor(@inject(SNS) private sns: SNS) {}

  async publish(
    event: string,
    payload: any,
    version: number,
    tenantId?: string
  ): Promise<void> {
    const { REGION, STAGE, ACCOUNT_ID } = process.env;

    const messageAttributes: any = {
      event: {
        DataType: 'String',
        StringValue: event,
      },
    };

    if (tenantId) {
      messageAttributes.tenantId = {
        DataType: 'String',
        StringValue: tenantId,
      };
    }

    await this.sns
      .publish({
        Message: JSON.stringify({
          event,
          version,
          payload,
        }),
        MessageAttributes: messageAttributes,
        TopicArn: `arn:aws:sns:${REGION}:${ACCOUNT_ID}:${STAGE}-qrpid-esb-service`,
      })
      .promise();
  }
}
