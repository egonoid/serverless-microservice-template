import { IPingService } from './interfaces/ping.service';
import { injectable } from 'inversify';

@injectable()
export default class PingService implements IPingService {
  ping(message: string): string {
    if (message) {
      return message;
    }

    return 'pong';
  }
}
