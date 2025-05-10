import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GetUser } from "src/auth/get-user.decorator";


@Controller('message')
export class MessageController{
    constructor(private messageService: MessageService) {}


    @Post()
    @UseGuards(JwtAuthGuard)
    async sendMessage(
        @Body() createMessageDto: {receiverId: number; content: string},
        @GetUser() user: {userId: number;email: string; role: string},
    ) {
  return this.messageService.sendMessage(user.userId, createMessageDto)
    }

    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async getMessagesForUser(
        @Param('useId', ParseIntPipe) userId: number,
        @GetUser() user: {userId: number; email: string; role: string},
    ) {
        return this.messageService.getMessageForUser(userId);
    }

    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    async markAsRead(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: {userId: number; email: string; role: string},
    ) {
        return this.messageService.markAsRead(id, user.userId)
    }
}