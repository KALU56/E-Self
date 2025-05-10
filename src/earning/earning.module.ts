import { Module } from "@nestjs/common";
import { EarningController } from "./earning.controller";
import { EarningsService } from "./earning.service";
import { PrismaService } from "src/prisma/prisma.service";


@Module({

    controllers:  [EarningController],
providers: [EarningsService, PrismaService],
})
export class EarningModule {}