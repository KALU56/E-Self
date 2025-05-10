import { registerAs } from '@nestjs/config';

export interface ChapaConfig {
  secretKey: string;
  webhookSecret: string;
  baseUrl: string;
}

export default registerAs('chapa', (): ChapaConfig => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
  const baseUrl = process.env.CHAPA_BASE_URL;

  if (!secretKey || !webhookSecret || !baseUrl) {
    throw new Error(
      `Chapa configration uncomplete. Required variables: 
       -CHAPA_SECRET_KEY: ${secretKey ? 'Provided' : 'Missing'}
       -CHAPA_WEBHOOK_SECRET=${webhookSecret ? 'Provided': 'Missing' }
       -CHAPA_BASE_URL=${baseUrl ? 'Provided' : 'Missing'}`
    );
  }

  return {
    secretKey,
    webhookSecret,
    baseUrl,
  };
});