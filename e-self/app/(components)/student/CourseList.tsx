// app/(components)/CourseCard.tsx
import Link from 'next/link';
import { Course } from '../../data/courses';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden" 
    >
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-3 h-16 overflow-hidden text-ellipsis">
          {course.description}
        </p>
        <span className="text-[#8E1616] font-semibold">${course.price}</span>
      </div>
    </Link>
  );
}