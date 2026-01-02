export interface INotifier {
  type: string;
  send(recipient: string, message: string): Promise<boolean>;
}

