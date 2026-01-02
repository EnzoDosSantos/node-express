import { INotifier } from './notifier.interface';
import logger from '../utils/logger';

export class EmailNotifier implements INotifier {
  readonly type = 'email';

  async send(recipient: string, message: string): Promise<boolean> {
    logger.info(`[EMAIL] Enviando a: ${recipient}`);
    logger.info(`[EMAIL] Asunto: Notificación de Alerta`);
    logger.info(`[EMAIL] Cuerpo: ${message}`);
    
    await this.simulateSend();
    
    logger.info(`[EMAIL] Enviado exitosamente a ${recipient}`);
    return true;
  }

  private simulateSend(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 100));
  }
}

