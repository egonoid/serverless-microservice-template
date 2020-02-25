import { Container, decorate, injectable } from 'inversify';
import * as Types from './types';
import { IPingService } from '../../application/services/interfaces/ping.service';
import PingService from '../../application/services/ping.service';
import { SNS } from 'aws-sdk';
import EventService from '../../application/services/event.service';
import { IEventService } from '../../application/services/interfaces/event.service';

const container = new Container({ skipBaseClassChecks: true });

container.bind<IPingService>(Types.PingService).to(PingService);
container.bind<IEventService>(Types.EventService).to(EventService);

decorate(injectable(), SNS);
container.bind<SNS>(SNS).to(SNS);

export default container;
