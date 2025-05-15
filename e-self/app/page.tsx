
import CourseListSlider from './(components)/student/CourseListSlider';
import Hero from './(components)/student/Hero';
import { courses } from './data/courses';

export default function Home() {
  
  const topRatedCourses = courses.filter((course) => course.rating >= 4.5);

  // Group courses by category
  const categorizedCourses = courses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="bg-[#EEEEEE] min-h-screen">
      <Hero />
      <div className="container mx-auto p-4">
        {/* Top Rated Courses */}
        <CourseListSlider
          title="Top Rated Courses"
          courses={topRatedCourses}
        />

        {/* Courses by Category */}
        {Object.entries(categorizedCourses).map(([category, courses]) => (
          <CourseListSlider key={category} title={`${category} Courses`} courses={courses} />
        ))}

        {/* All Courses */}
        <CourseListSlider title="All Courses" courses={courses} />
      </div>
    </div>
  );
}
