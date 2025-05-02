import { Module } from "@nestjs/common";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";


@Module({
    controllers: [ContentController],
    providers: [ContentService, PrismaService, JwtService],

})
export class ContentModule {}