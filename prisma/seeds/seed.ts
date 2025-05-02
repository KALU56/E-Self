import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Clear existing data
    await prisma.quizSubmission.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.discount.deleteMany();
    await prisma.courseAnalytics.deleteMany();
    await prisma.userAnalytics.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.review.deleteMany();
    await prisma.earning.deleteMany();
    await prisma.message.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.content.deleteMany();
    await prisma.courseTranslation.deleteMany();
    await prisma.course.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const student = await prisma.user.create({
      data: {
        email: 'student@gmail.com',
        password: await bcrypt.hash('pass123', 10),
        name: 'Test Student',
        phone: '+251941416514',
        role: 'STUDENT',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Test',
            lastName: 'Student',
            bio: 'Eager learner',
            avatar: 'https://example.com/avatar1.jpg',
          },
        },
      },
    });

    const unverifiedStudent = await prisma.user.create({
      data: {
        email: 'unverified@gmail.com',
        password: await bcrypt.hash('pass123', 10),
        name: 'Unverified Student',
        phone: '+251941416515',
        role: 'STUDENT',
        isVerified: false,
        verificationToken: 'unverified-token',
      },
    });

    const instructor = await prisma.user.create({
      data: {
        email: 'instructor@gmail.com',
        password: await bcrypt.hash('pass123', 10),
        name: 'Test Instructor',
        phone: '+251941416516',
        role: 'INSTRUCTOR',
        isVerified: true,
        profile: {
          create: {
            firstName: 'Test',
            lastName: 'Instructor',
            bio: 'Experienced educator',
            avatar: 'https://example.com/avatar2.jpg',
          },
        },
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('pass123', 10),
        name: 'Admin',
        phone: '+251941416517',
        role: 'ADMIN',
        isVerified: true,
      },
    });

    // Create tags
    const tag1 = await prisma.tag.create({
      data: { name: 'Programming' },
    });
    const tag2 = await prisma.tag.create({
      data: { name: 'Web Development' },
    });

    // Create courses
    const course1 = await prisma.course.create({
      data: {
        title: 'Introduction to Programming',
        description: 'Learn coding basics',
        instructorId: instructor.id,
        price: 100, // Affordable in ETB
        duration: 30,
        level: 'Beginner',
        category: 'Programming',
        language: 'en',
        imageUrl: 'https://example.com/course1.jpg',
        isPublished: true,
        tags: { connect: [{ id: tag1.id }] },
        translations: {
          create: {
            language: 'am', // Amharic
            title: 'ፕሮግራሚንግ መግቢያ',
            description: 'የኮድ መሰረታዊ ነገሮችን ይማሩ',
            category: 'ፕሮግራሚንግ',
          },
        },
      },
    });

    const course2 = await prisma.course.create({
      data: {
        title: 'Web Development',
        description: 'Build modern websites',
        instructorId: instructor.id,
        price: 200,
        duration: 45,
        level: 'Intermediate',
        category: 'Web Development',
        language: 'en',
        imageUrl: 'https://example.com/course2.jpg',
        isPublished: true,
        tags: { connect: [{ id: tag2.id }] },
        translations: {
          create: {
            language: 'am',
            title: 'ድር ልማት',
            description: 'ዘመናዊ ድረ-ገፆችን ይገንቡ',
            category: 'ድር ልማት',
          },
        },
      },
    });

    // Create enrollment and payment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: course1.id,
        progress: 100,
        enrolledAt: new Date(),
        completedAt: new Date(),
        payment: {
          create: {
            amount: 100,
            method: 'Chapa',
            transactionId: 'tx-123456',
            status: 'COMPLETED',
            userId: student.id,
            createdAt: new Date(),
          },
        },
      },
    });

    // Create contents
    const note = await prisma.content.create({
      data: {
        courseId: course1.id,
        title: 'Programming Basics Notes',
        type: 'NOTE',
        content: 'Introduction to variables and data types.',
        url: '/uploads/notes/programming-basics.pdf',
        order: 1,
      },
    });

    const video = await prisma.content.create({
      data: {
        courseId: course1.id,
        title: 'Variables Lecture',
        type: 'VIDEO',
        url: '/uploads/videos/variables.mp4',
        order: 2,
      },
    });

    const quiz = await prisma.content.create({
      data: {
        courseId: course1.id,
        title: 'Programming Basics Quiz',
        type: 'QUIZ',
        content: JSON.stringify([
          {
            question: 'What is a variable?',
            options: ['A storage location', 'A function', 'A loop', 'A class'],
            correctAnswer: 'A storage location',
          },
        ]),
        order: 3,
      },
    });

    // Create quiz submission
    const quizSubmission = await prisma.quizSubmission.create({
      data: {
        userId: student.id,
        contentId: quiz.id,
        answers: JSON.stringify([{ question: 'What is a variable?', answer: 'A storage location' }]),
        score: 100,
        submittedAt: new Date(),
      },
    });

    console.log('Seeded:', {
      student,
      unverifiedStudent,
      instructor,
      admin,
      tag1,
      tag2,
      course1,
      course2,
      enrollment,
      note,
      video,
      quiz,
      quizSubmission,
    });
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();