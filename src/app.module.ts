import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/courses.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CoursesModule,
    ContentModule,
    PaymentsModule,
    PrismaModule,
    EnrollmentModule],
  
})
export class AppModule {}
