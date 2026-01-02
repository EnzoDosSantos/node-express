import { Request, Response } from 'express';
import { defaultAlertService, createAlertService } from '../config/notifier.factory';
import logger from '../utils/logger';

class AlertsController {
  async sendAlert(req: Request, res: Response): Promise<void> {
    const { recipient, message, channel } = req.body;

    if (!recipient || !message) {
      res.status(400).json({
        success: false,
        error: 'recipient and message are required',
      });
      return;
    }

    try {
      const service = channel 
        ? createAlertService(channel) 
        : defaultAlertService;

      const result = await service.sendAlert(recipient, message);

      res.json({
        success: true,
        data: {
          sent: result,
          channel: service.getNotifierType(),
          recipient,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error(`Fallo al enviar alerta: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        error: 'Failed to send alert',
      });
    }
  }
}

export const alertsController = new AlertsController();

