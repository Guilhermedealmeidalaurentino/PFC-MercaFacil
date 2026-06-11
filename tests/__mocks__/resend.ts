export class Resend {
  emails = {
    send: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  };
  constructor(_apiKey: string) {}
}