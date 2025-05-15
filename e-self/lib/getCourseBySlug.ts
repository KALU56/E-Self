import { Course } from '../app/types/course';
import { courses } from '../app/data/courses';

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  return courses.find(course => course.id === slug) || null;
}
