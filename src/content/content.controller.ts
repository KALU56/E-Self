import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Request, Req } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateContentDto } from "./dto/create-content.dto";
import { ContentService } from "./content.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { extname } from "path";
import { diskStorage } from "multer";


@Controller('courses/:courseId/content')
@UseGuards(JwtAuthGuard)
export class ContentController{
    constructor(private contentService: ContentService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const type = req.body.type === 'NOTE' ? './uploads/notes' : './uploads/videos';
          cb(null, type);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.mp4'];
        const ext = extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Only PDFs and MP4s are allowed'), false);
        }
      },
    }))
    async createContent(
      @Param('courseId') courseId: string,
      @Body() dto: CreateContentDto,
      @UploadedFile() file: Express.Multer.File,
      @Req() req,
    ) {
      const url = file ? `/uploads/${dto.type === 'NOTE' ? 'notes' : 'videos'}/${file.filename}` : undefined;
      return this.contentService.createContent(parseInt(courseId), { ...dto, url }, req.user.sub);
    }
  
    @Get()
    async getCourseContent(@Param('courseId') courseId: string, @Request() req) {
      return this.contentService.getCourseContent(parseInt(courseId), req.user.sub);
    }
  
    @Post(':contentId/submit-quiz')
    async submitQuiz(
      @Param('courseId') courseId: string,
      @Param('contentId') contentId: string,
      @Body() dto: SubmitQuizDto,
      @Request() req,
    ) {
      return this.contentService.submitQuiz(parseInt(contentId), req.user.sub, dto);
    }
  
    @Get(':contentId/download')
    async downloadContent(@Param('contentId') contentId: string, @Request() req) {
      return this.contentService.downloadContent(parseInt(contentId), req.user.sub);
    }
  }

function customDiskStorage(arg0: { destination: (req: any, file: any, cb: any) => void; filename: (req: any, file: any, cb: any) => void; }): any {
    throw new Error("Function not implemented.");
}
