// src/payment/payment.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPayment(@Req() req: Request & {user: { sub: number}}, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.initiatePayment(req.user.sub, createPaymentDto);
  }
@Post('webhook')
async handleWebhook(@Body() body: any, @Headers('chapa-signature') signature: string) {
  // Verify webhook signature
  // This is important for security
  
  const transactionId = body.tx_ref;
  return this.paymentService.verifyPayment(transactionId);
}
  @Get('verify')
  async verifyPayment(@Query('tx_ref') transactionId: string) {
    return this.paymentService.verifyPayment(transactionId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getPaymentHistory(@Req() req: Request & {user: { sub: number}}) {
    return this.paymentService.getPaymentHistory(req.user.sub);
  }
}