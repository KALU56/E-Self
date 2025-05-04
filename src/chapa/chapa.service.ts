// src/chapa/chapa.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChapaService {
  private readonly chapaUrl = 'https://api.chapa.co/v1/transaction/initialize';
  private readonly verifyUrl = 'https://api.chapa.co/v1/transaction/verify/';

  constructor(private configService: ConfigService) {}

  async initializePayment(paymentData: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    tx_ref: string;
    callback_url: string;
    return_url: string;
    customization: {
      title: string;
      description: string;
    };
  }) {
    const response = await axios.post(
      this.chapaUrl,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('CHAPA_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  async verifyPayment(transactionId: string) {
    const response = await axios.get(
      `${this.verifyUrl}${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get('CHAPA_SECRET_KEY')}`,
        },
      }
    );
    return response.data;
  }
}