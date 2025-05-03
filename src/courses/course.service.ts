import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewCourseDto } from './dto/create-course.dto';
import { UserRole } from 'src/user/user.constants';
import { Course } from '@prisma/client';
import { SearchCoursesDto } from './dto/search-course.dto';
@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  private async validateInstructor(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== UserRole.INSTRUCTOR) {
      throw new ForbiddenException('Only instructors can manage courses');
    }
  }
    async createCourse(dto: CreateNewCourseDto, userId: number): Promise<Course>{
        // check if user is an instructor
    
        await this.validateInstructor(userId);

        // validate price is a positive number
        if (dto.price <= 0) {
            throw new ForbiddenException('Price must be a positive number');
        }
        // validate duration is a positive number
        if (dto.duration <= 0) {
            throw new ForbiddenException('Duration must be a positive number');
        }
    return this.prisma.course.create({
     data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        category: dto.category,
        language: dto.language,
        level: dto.level,
        instructorId: userId,
        isPublished: false,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async getCourses(includeUnpublished = false) {
    return this.prisma.course.findMany({ 
      where: includeUnpublished ? {} : { isPublished: true},
      include: { instructor: {
         select: {
          id: true,
          name: true,
          email: true,
         }
      },
    _count: {
      select: {
        enrollments: true,
        reviews: true
      }
    } },
  orderBy: {
    createdAt: 'desc'
  } });
  }

  async getCourseById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            
          }
        },
        contents: {
          orderBy: {
            order: 'asc'
          }
        },
        reviews:{
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            enrollments: true,
          }
        }
      }
    })
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    return course;
  }
  async updateCourse(id: number, dto: CreateNewCourseDto, userId: number): Promise<Course> {
    await this.validateInstructor(userId);

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You are not authorized to update this course');
    }
    return this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async togglePublishCourse(id: number, userId: number): Promise<Course> {
    await this.validateInstructor(userId);

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You are only publishe your own courses');
    }

    //validate course has content before publishing
    if(!course.isPublished){
      const cotentCount = await this.prisma.content.count({
        where: { courseId: id }
      });
      if (cotentCount === 0) {
        throw new ForbiddenException('Course must have at least one content before publishing');
      }
    }
    return this.prisma.course.update({
      where: { id },
      data: {
        isPublished: !course.isPublished,
        updatedAt: new Date(),
    
      }
    });
  }


  async deleteCourse(id: number, userId: number): Promise<Course> {
    await this.validateInstructor(userId);

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this course');
    }
   // soft delete implementation

   return this.prisma.course.update({
    where: { id },
    data: {
      isPublished: true,
      updatedAt: new Date(),
    }
   });
  }

  async getInstructorCourses(userId: number) {
    await this.validateInstructor(userId);
    return this.prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
        },
        orderBy: {
            createdAt: 'desc'
        }
    
    });
  }

async searchCourses(filters: SearchCoursesDto) {
  const {
    search,
    category,
    language,
    level,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    isPublished
  } = filters;

  return this.prisma.course.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        category ? { category } : {},
        language ? { language } : {},
        level ? { level } : {},
        minPrice ? { price: { gte: minPrice } } : {},
        maxPrice ? { price: { lte: maxPrice } } : {},
        minDuration ? { duration: { gte: minDuration } } : {},
        maxDuration ? { duration: { lte: maxDuration } } : {},
        isPublished !== undefined ? { isPublished } : {}
      ]
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
}