import Link from 'next/link';
import { Course } from '../../data/courses';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="w-72 h-[400px] rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col"> 
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs bg-[#8E1616] text-white px-2 py-1 rounded-full">
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-sm">
            ⭐ {course.rating}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2 flex-grow">
          {course.description.substring(0, 100)}...
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="text-sm">
            <span className="mr-2">🕒 {course.duration}h</span>
            <span className="font-semibold">${course.price}</span>
          </div>
          <Link href={`/courses/${course.slug}`}>
            <button className="bg-[#8E1616] text-white px-3 py-1 rounded-full text-xs hover:bg-[#D84040] transition-colors">
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
