import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/course.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ContentModule } from './content/content.module';
import { ChapaModule } from './chapa/chapa.module';
import { MessageModule } from './Message/message.module';
import { CertificatesModule } from './certificate/certificates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [chapaConfig],
      envFilePath: '.env', 
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().required().min(10),
        EMAIL_USER: Joi.string().email().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        CHAPA_SECRET_KEY: Joi.string().required(),
        CHAPA_PUBLIC_KEY: Joi.string().required(),
        CHAPA_API_URL: Joi.string().uri().required(),
        CHAPA_WEBHOOK_URL: Joi.string().uri().required(),
        BASE_URL: Joi.string().uri().required(),
        FRONTEND_URL: Joi.string().uri().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    AuthModule,
    UserModule,
    CoursesModule,
    CertificatesModule,
    ContentModule,
    MessageModule,
    PaymentsModule,
    PrismaModule,
    ChapaModule,
    EnrollmentModule,
  ],
})
export class AppModule {}