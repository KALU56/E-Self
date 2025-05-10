import { Controller, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Post('content/:contentId/complete')
    @UseGuards(JwtAuthGuard)
    async markAsCompleted(
        @Param('contentId') contentId: number,
        @Request() req
    ) {
        return this.progressService.markContentAsCompleted(
            req.user.id,
            contentId
        );
    }
    @Get('course/:courseId')
    @UseGuards(JwtAuthGuard)
    async getCourseProgress(
        @Param('courseId') courseId: string,
        @Request() req
    ) {
        return {
            items: await this.progressService.getUserProgress(
                req.user.id,
                parseInt(courseId)
            ),
            percentage: await this.progressService.getCourseCompletionPercentage(
                req.user.id,
                parseInt(courseId)
            ),
        }
}
}