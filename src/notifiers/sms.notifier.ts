import { INotifier } from './notifier.interface';
import logger from '../utils/logger';

export class SmsNotifier implements INotifier {
  readonly type = 'sms';

  async send(recipient: string, message: string): Promise<boolean> {
    logger.info(`[SMS] Enviando a: ${recipient}`);
    logger.info(`[SMS] Mensaje: ${message.substring(0, 160)}`);
    
    await this.simulateSend();
    
    logger.info(`[SMS] Enviado exitosamente a ${recipient}`);
    return true;
  }

  private simulateSend(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 50));
  }
}

