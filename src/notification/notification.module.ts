import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { PrismaService } from "src/prisma/prisma.service";
import e from "express";


@Module({
    imports: [AuthModule],
    controllers: [NotificationController],
    providers: [NotificationService, PrismaService],
})

export class NotificationModule { } // This module handles the notification functionality of the application.