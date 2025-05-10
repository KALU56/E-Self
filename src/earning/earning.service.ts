import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EarningsService {
  constructor(private prisma: PrismaService) {}

  async getEarnings(instructorId: number) {
    const instructor = await this.prisma.user.findUnique({ where: { id: instructorId } });
    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      throw new NotFoundException('Instructor not found');
    }

    return this.prisma.earning.findMany({
      where: { instructorId },
      include:{
        payment: {
            select: {
                id: true,
                amount: true,
                transactionId: true,
                status: true,
                createdAt: true,
            },
        },
        instructor:{
            select:{
                id: true,
                name: true,
                email: true,
            },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async withdrawEarning(earningId: number, instructorId: number) {
    const earning = await this.prisma.earning.findUnique({ where: { id: earningId } });
    if (!earning) {
      throw new NotFoundException('Earning not found');
    }
    if (earning.instructorId !== instructorId) {
      throw new ForbiddenException('Only the instructor can withdraw this earning');
    }
    if (earning.withdrawn) {
      throw new ForbiddenException('Earning already withdrawn');
    }

    return this.prisma.earning.update({
      where: { id: earningId },
      data: { withdrawn: true },
    });
  }
}