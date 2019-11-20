import { Container } from 'inversify';
import * as Types from './types';
import { IPingService } from '../../application/services/interfaces/ping.service';
import PingService from '../../application/services/ping.service';

const container = new Container({ skipBaseClassChecks: true });

container.bind<IPingService>(Types.PingService).to(PingService);

export default container;
