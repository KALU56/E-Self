import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ChapaModule } from '../chapa/chapa.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ChapaModule, //Import the module (not the service directly)
  ],
  controllers: [PaymentController],
  providers: [PaymentService,JwtService],
})
export class PaymentsModule {}