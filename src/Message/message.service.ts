import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class  MessageService {
    constructor(private prisma: PrismaService) {}


    async sendMessage(senderId: number, data: {receiverId: number; content: string}) {
        const receiver = await this.prisma.user.findUnique({
            where: {id: data.receiverId}
        })
        if(!receiver){
            throw new NotFoundException('Receiver not found')
        }

        return this.prisma.message.create ({
            data: {
                senderId,
                receiverId: data.receiverId,
                content: data.content,
            }
        })
    }

    async getMessageForUser(userId: number) {
        return this.prisma.message.findMany({
            where: {
                OR: [{ senderId: userId}, { receiverId: userId}],
            },
            orderBy: { sentAt: 'desc'},
        })
    }

    async markAsRead(messageId: number, userId: number) {
        const message = await this.prisma.message.findUnique({
            where: {
                id: messageId
            }
        })
        if(!message) {
            throw new NotFoundException('Message not found');
        }

        return this.prisma.message.update({
            where: {id: messageId},
            data: {isRead: true},
        })
    }
}