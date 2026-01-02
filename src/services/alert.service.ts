import { INotifier } from '../notifiers';
import logger from '../utils/logger';

export class AlertService {
  constructor(private notifier: INotifier) {}

  async sendAlert(recipient: string, message: string): Promise<boolean> {
    logger.info(`Servicio de alertas: preparando envío via ${this.notifier.type}`);
    
    const result = await this.notifier.send(recipient, message);
    
    if (result) {
      logger.info(`Servicio de alertas: notificación enviada exitosamente`);
    } else {
      logger.error(`Servicio de alertas: fallo al enviar notificación`);
    }
    
    return result;
  }

  getNotifierType(): string {
    return this.notifier.type;
  }
}

