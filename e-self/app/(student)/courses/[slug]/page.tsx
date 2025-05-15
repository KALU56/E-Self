'use client';

import { useParams } from 'next/navigation';
import { courses } from '../../../data/courses';
import Image from 'next/image';
import CourseModuleSection from '@/components/CourseModuleSection';

export default function CoursePage() {
  const { slug } = useParams() as { slug: string };
  const course = courses.find(course => course.id === slug);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="w-full h-72 relative">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover rounded-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <p className="text-sm">{course.detailedDescription}</p>

          <div className="mt-6 space-y-2">
            <div><strong>Duration:</strong> {course.duration} hours</div>
            <div><strong>Price:</strong> ${course.price}</div>
            <div><strong>Rating:</strong> ⭐ {course.rating}</div>
            <div><strong>Category:</strong> {course.category}</div>
            <div><strong>Instructor:</strong> {course.instructor.name} ({course.instructor.rating}⭐)</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
        {course.modules.map((module, index) => (
          <CourseModuleSection key={index} module={module} />
        ))}
      </div>
    </div>
  );
}
