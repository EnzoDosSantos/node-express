import { EmailNotifier } from '../../../src/notifiers/email.notifier';
import { SmsNotifier } from '../../../src/notifiers/sms.notifier';
import { AlertService } from '../../../src/services/alert.service';
import { createNotifier, createAlertService } from '../../../src/config/notifier.factory';

describe('Notifiers', () => {
  describe('EmailNotifier', () => {
    it('should have type email', () => {
      const notifier = new EmailNotifier();
      expect(notifier.type).toBe('email');
    });

    it('should send email successfully', async () => {
      const notifier = new EmailNotifier();
      const result = await notifier.send('test@example.com', 'Test message');
      expect(result).toBe(true);
    });
  });

  describe('SmsNotifier', () => {
    it('should have type sms', () => {
      const notifier = new SmsNotifier();
      expect(notifier.type).toBe('sms');
    });

    it('should send SMS successfully', async () => {
      const notifier = new SmsNotifier();
      const result = await notifier.send('+1234567890', 'Test message');
      expect(result).toBe(true);
    });
  });
});

describe('AlertService', () => {
  it('should send alert via email notifier', async () => {
    const service = new AlertService(new EmailNotifier());
    const result = await service.sendAlert('test@example.com', 'Alert!');

    expect(result).toBe(true);
    expect(service.getNotifierType()).toBe('email');
  });

  it('should send alert via SMS notifier', async () => {
    const service = new AlertService(new SmsNotifier());
    const result = await service.sendAlert('+1234567890', 'Alert!');

    expect(result).toBe(true);
    expect(service.getNotifierType()).toBe('sms');
  });
});

describe('Notifier Factory', () => {
  it('should create email notifier by default', () => {
    const notifier = createNotifier();
    expect(notifier.type).toBe('email');
  });

  it('should create email notifier when specified', () => {
    const notifier = createNotifier('email');
    expect(notifier.type).toBe('email');
  });

  it('should create SMS notifier when specified', () => {
    const notifier = createNotifier('sms');
    expect(notifier.type).toBe('sms');
  });

  it('should create AlertService with default notifier', () => {
    const service = createAlertService();
    expect(service.getNotifierType()).toBe('email');
  });

  it('should throw for unknown notifier type', () => {
    expect(() => createNotifier('unknown' as any)).toThrow('Unknown notifier type');
  });
});

