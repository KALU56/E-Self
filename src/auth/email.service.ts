// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// import { SentMessageInfo } from 'nodemailer';
// import { setTimeout } from 'timers/promises';

// interface EmailTemplate {
//   subject: string;
//   html: string;
// }

// interface EmailQueueItem {
//   to: string;
//   subject: string;
//   html: string;
//   retries: number;
// }

// @Injectable()
// export class EmailService {
//   private readonly logger = new Logger(EmailService.name);
//   private transporter: nodemailer.Transporter;
//   private emailQueue: EmailQueueItem[] = [];
//   private isProcessingQueue = false;
//   private readonly maxRetries = 3;
//   private readonly rateLimitDelay = 1000; // 1 second between emails

//   constructor(private configService: ConfigService) {
//     const emailUser = this.configService.get<string>('EMAIL_USER');
//     const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
//     const emailHost = this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com');
//     const emailPort = this.configService.get<number>('EMAIL_PORT', 587);

//     if (!emailUser || !emailPassword) {
//       this.logger.error('EMAIL_USER and EMAIL_PASSWORD must be set in .env');
//       throw new Error('Email credentials (EMAIL_USER and EMAIL_PASSWORD) must be set in .env');
//     }

//     this.transporter = nodemailer.createTransport({
//       host: emailHost,
//       port: emailPort,
//       secure: emailPort === 465, // Use SSL for port 465, STARTTLS for 587
//       pool: true, // Enable connection pooling
//       maxConnections: 5,
//       maxMessages: 100,
//       connectionTimeout: 30000, // 10 seconds
//       auth: {
//         user: emailUser,
//         pass: emailPassword,
//       },
//     });

//     this.verifyTransporter();
//     this.processEmailQueue();
//   }

//   private async verifyTransporter(): Promise<void> {
//     try {
//       await this.transporter.verify();
//       this.logger.log('SMTP Server is ready to send emails');
//     } catch (error) {
//       this.logger.error(`SMTP Connection Error: ${error.message}`, error.stack);
//       throw new Error('Failed to initialize SMTP transporter');
//     }
//   }

//   private getVerificationTemplate(language: string, verificationUrl: string): EmailTemplate {
//     const templates: Record<string, EmailTemplate> = {
//       en: {
//         subject: 'Verify Your Email',
//         html: `
//           <h2>Welcome to the E-Learning Platform!</h2>
//           <p>Please verify your email by clicking the link below:</p>
//           <a href="${verificationUrl}">Verify Email</a>
//           <p>If you didn't register on our platform, please ignore this email.</p>
//         `,
//       },
//       am: {
//         subject: 'ኢ-ሜልዎን ያረጋግጡ',
//         html: `
//           <h2>ወደ ኢ-ማማር መድረክ እንኳን ደህና መጡ!</h2>
//           <p>ኢ-ሜልዎን ለማረጋገጥ እባክዎ ከዚህ በታች ያለውን አገናኝ ይጫኑ፡</p>
//           <a href="${verificationUrl}">ኢሜል አረጋግጥ</a>
//           <p>እርስዎ ካልተመዘገቡ፣ ይህን ኢሜል ችላ ይበሉ።</p>
//         `,
//       },
//     };
//     return templates[language] || templates.en;
//   }

//   async sendVerificationEmail(email: string, token: string, language: string): Promise<{ success: boolean; message?: string }> {
//     this.logger.debug(`Queueing verification email to ${email} in language ${language}`);
//     const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
//     const verificationUrl = `${baseUrl}/auth/verify?token=${token}`;
//     const template = this.getVerificationTemplate(language, verificationUrl);

//     return this.queueEmail(email, template.subject, template.html);
//   }

//   async sendEmail(email: string, subject: string, html: string): Promise<{ success: boolean; message?: string }> {
//     this.logger.debug(`Queueing email to ${email} with subject "${subject}"`);
//     return this.queueEmail(email, subject, html);
//   }

//   private async queueEmail(to: string, subject: string, html: string): Promise<{ success: boolean; message?: string }> {
//     const queueItem: EmailQueueItem = { to, subject, html, retries: 0 };
//     this.emailQueue.push(queueItem);
//     this.logger.debug(`Email queued for ${to}. Queue length: ${this.emailQueue.length}`);

//     // Trigger queue processing if not already running
//     if (!this.isProcessingQueue) {
//       this.processEmailQueue();
//     }

//     // Wait for the email to be processed (simplified, could use a Promise-based approach)
//     while (this.emailQueue.includes(queueItem)) {
//       await setTimeout(100);
//     }

//     return queueItem.retries >= 0
//       ? { success: true, message: 'Email sent successfully' }
//       : { success: false, message: 'Failed to send email after retries' };
//   }

//   private async processEmailQueue(): Promise<void> {
//     if (this.isProcessingQueue) return;
//     this.isProcessingQueue = true;

//     while (this.emailQueue.length > 0) {
//       const item = this.emailQueue[0]; // Peek at the first item
//       try {
//         await this.transporter.sendMail({
//           from: `"E-Learning Platform" <${this.configService.get<string>('EMAIL_USER')}>`,
//           to: item.to,
//           subject: item.subject,
//           html: item.html,
//         });

//         this.logger.log(`Email sent to ${item.to} with subject "${item.subject}"`);
//         this.emailQueue.shift(); // Remove successfully sent email
//       } catch (error) {
//         item.retries++;
//         this.logger.warn(`Failed to send email to ${item.to} (Attempt ${item.retries}/${this.maxRetries}): ${error.message}`);

//         if (item.retries >= this.maxRetries) {
//           this.logger.error(`Max retries reached for email to ${item.to}. Discarding.`);
//           this.emailQueue.shift();
//         }
//       }

//       // Rate limit: Wait between emails to avoid overwhelming the SMTP server
//       await setTimeout(this.rateLimitDelay);
//     }

//     this.isProcessingQueue = false;
//   }

//   async close(): Promise<void> {
//     this.transporter.close();
//     this.logger.log('SMTP transporter closed');
//   }
// }





import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    constructor(private configService: ConfigService) {
        
        
    // intialize Nodemailer transporter with environment variables
       
        const emailUser = this.configService.get<string>('EMAIL_USER');
        const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

        if (!emailUser || !emailPassword) {
            throw new Error('Email credentials (EMAIL_USER and EMAIL_PASSWORD) must be set in .env');
        }
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
            port: this.configService.get<number>('EMAIL_PORT', 587),
            secure: false,
            auth: {
               user: emailUser,
                pass: emailPassword,
            },
        });
    }

    // send verification email
    async sendVerificationEmail(email: string, token: string, language: string) {
        const verificationUrl = `${this.configService.get<string>('BASE_URL', 'http://localhost:5000')}auth/verify?token=${token}`;
        
        // multi-language email templates
        const templates = {
            en: {
                subject: 'Verify your email',
                html: `
                <h2>Welcome to the E-Learning Platform!</h2>
                    <p>Please verify your email by clicking  the link below:</p>
                    <a href="${verificationUrl}">Verify email</a>
                    <p>If you didn't register on our platform, please ignore this email.</p>
                `,
            },
            am: {
                subject: 'ኢ-ሜልዎን ያረጋግጡ',
                html: `
          <h2>ወደ ኢ-ማማር መድረክ እንኳን ደህና መጡ!</h2>
          <p>ኢ-ሜልዎን ለማረጋገጥ እባክዎ ከዚህ በታች ያለውን አገናኝ ይጫኑ፡</p>
          <a href="${verificationUrl}">ኢሜል አረጋግጥ</a>
          <p>እርስዎ ካልተመዘገቡ፣ ይህን ኢሜል ችላ ይበሉ።</p>
        `,
            },
        };
        const template = templates[language] || templates.en;  // default to English

        try {
            await this.transporter.sendMail({
                from: `"E-Learning Platform" <${this.configService.get<string>('EMAIL_USER')}>`,
                to: email,
                subject: template.subject,
                html: template.html,
            });
            console.log(`Verification email sent to ${email}`);
            return {success: true, message: 'Verification email sent successfully' };
        } catch (error) {
            console.error(`Failed to send verification email to ${email}: ${error.message}`);
            return { success: false, message: 'Failed to send verification email' };
        }
    }

    // generic email for sending other email (e.g notifications)
    async sendEmail(email: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: `"E-Learning Platform" <${this.configService.get<string>('EMAIL_USER')}>`,
                to: email,
                subject,
                html,
            });
            console.log(`Email sent to ${email}`);
            return {success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error(`Failed to send email to ${email}: ${error.message}`);
            return { success: false, message: 'Failed to send email' };
        }
            
    }   

    }