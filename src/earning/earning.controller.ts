import { Controller, Get, Post, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EarningsService } from './earning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('earnings')
export class EarningController {
  constructor(private earningService: EarningsService) {}

  @Get('instructor/:instructorId')
  @UseGuards(JwtAuthGuard)
  async getEarnings(
    @Param('instructorId', ParseIntPipe) instructorId: number,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    return this.earningService.getEarnings(instructorId);
  }

  @Post('withdraw/:earningId')
  @UseGuards(JwtAuthGuard)
  async withdrawEarning(
    @Param('earningId', ParseIntPipe) earningId: number,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    return this.earningService.withdrawEarning(earningId, user.userId);
  }
}