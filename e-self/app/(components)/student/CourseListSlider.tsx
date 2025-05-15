'use client';

import { useRef } from 'react';
import CourseCard from '../../../components/CourseCard'
import { Course } from '../../types/course';

interface CourseListSliderProps {
  title: string;
  courses: Course[] | undefined | null;
}

export default function CourseListSlider({ title, courses }: CourseListSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Optional: for debugging
  // console.log("Courses received:", courses);

  // Safe fallback
  const validCourses = Array.isArray(courses) ? courses : [];

  return (
    <div className="mb-8 px-0 lg:px-24"> 
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide"
        >
          {validCourses.length > 0 ? (
            validCourses.map((course) =>
              course && course.id ? (
                <div key={course.id} className="flex-shrink-0 w-72">
                  <CourseCard course={course} />
                </div>
              ) : null
            )
          ) : (
            <p className="text-gray-500">No courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
