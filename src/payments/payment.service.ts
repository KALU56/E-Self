import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChapaService } from '../chapa/chapa.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private chapaService: ChapaService,
    private configService: ConfigService,
  ) {}

  async initiatePayment(userId: number, createPaymentDto: CreatePaymentDto) {
    const { courseId, amount } = createPaymentDto;

    // Validate amount
    if (amount <= 0) {
      throw new NotFoundException('Amount must be greater than 0');
    }

    // Verify course exists and get price
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Verify price matches if needed
    if (amount !== course.price) {
      this.logger.warn(`Payment amount ${amount} doesn't match course price ${course.price}`);
      // Uncomment to enforce price matching
      // throw new NotFoundException('Payment amount doesn't match course price');
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate unique transaction ID
    const transactionId = `chapa-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        amount,
        method: 'CHAPA',
        status: 'PENDING',
        userId,
        courseId,
        transactionId,
      },
    });

    try {
      // Initialize Chapa payment
      const chapaResponse = await this.chapaService.initializePayment({
        amount: amount,
        email: user.email,
        firstName: user.name.split(' ')[0] || 'User',
        lastName: user.name.split(' ')[1] || 'Customer',
        tx_ref: payment.transactionId,
        callback_url: `${this.configService.get('BASE_URL')}/payment/verify`,
        return_url: `${this.configService.get('FRONTEND_URL')}/payment/success`,
        customization: {
          title: `Payment for ${course.title}`,
          description: `Course enrollment payment`,
        },
      });

      this.logger.log(`Payment initiated for user ${userId} on course ${courseId}`);

      return {
        paymentId: payment.id,
        checkoutUrl: chapaResponse.data.checkout_url,
      };
    } catch (error) {
      // Update payment status if initialization fails
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      this.logger.error(`Payment initialization failed: ${error.message}`);
      throw error;
    }
  }

  async verifyPayment(transactionId: string) {
    this.logger.log(`Verifying payment: ${transactionId}`);

    try {
      // Verify with Chapa
      const verification = await this.chapaService.verifyPayment(transactionId);

      // Update payment status
      const payment = await this.prisma.payment.update({
        where: { transactionId },
        data: {
          status: verification.status === 'success' ? 'COMPLETED' : 'FAILED',
          receiptUrl: verification.receipt_url || null,
        },
        include: {
          user: { select: { id: true, email: true } },
          course: { select: { id: true, title: true } },
        },
      });

      // If payment successful, create enrollment
      if (payment.status === 'COMPLETED') {
        const enrollment = await this.prisma.enrollment.create({
          data: {
            studentId: payment.userId,
            courseId: payment.courseId,
            progress: 0,
            status: 'ACTIVE',
            enrolledAt: new Date(),
          },
        });

        // Link enrollment to payment
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { enrollmentId: enrollment.id },
        });

        this.logger.log(`Payment completed and enrollment created: ${enrollment.id}`);
        return { payment, enrollment };
      }

      this.logger.warn(`Payment verification failed: ${transactionId}`);
      return { payment };
    } catch (error) {
      this.logger.error(`Payment verification error: ${error.message}`);
      throw error;
    }
  }

  async getPaymentHistory(userId: number) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async handleWebhook(payload: any) {
    const transactionId = payload.tx_ref;
    if (!transactionId) {
      this.logger.error('Webhook missing transaction reference');
      return { success: false };
    }

    return this.verifyPayment(transactionId);
  }
}