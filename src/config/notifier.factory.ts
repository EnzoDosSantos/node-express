import { INotifier, EmailNotifier, SmsNotifier } from '../notifiers';
import { AlertService } from '../services/alert.service';

type NotifierType = 'email' | 'sms';

const notifiers: Record<NotifierType, () => INotifier> = {
  email: () => new EmailNotifier(),
  sms: () => new SmsNotifier(),
};

export function createNotifier(type: NotifierType = 'email'): INotifier {
  const factory = notifiers[type];
  if (!factory) {
    throw new Error(`Unknown notifier type: ${type}`);
  }
  return factory();
}

export function createAlertService(type: NotifierType = 'email'): AlertService {
  const notifier = createNotifier(type);
  return new AlertService(notifier);
}

const defaultNotifierType = (process.env.DEFAULT_NOTIFIER || 'email') as NotifierType;
export const defaultAlertService = createAlertService(defaultNotifierType);

