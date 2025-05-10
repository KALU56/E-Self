import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";


@Module({
    controllers: [MessageController],
    providers: [MessageService, PrismaService,JwtService],
})
export class MessageModule {}