"use client";
import React, { useState, useMemo } from 'react';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const primaryColor = '#8E1616';
const primaryColorLight = '#B34747';

interface Course {
  id: number;
  title: string;
  imageUrl: string;
  altText: string;
  instructorName: string;
  instructorRole: string;
  instructorCompany: string;
  yearPublished: number;
  description: string;
  enrolledStudents: number;
  rating: number;
  publishDate: Date;
  reviewCount: string;
  status: 'published' | 'planned' | 'unfinished' | 'padding-for-publish';
}

const Card: React.FC<Course> = ({
  imageUrl,
  altText,
  instructorName,
  instructorRole,
  instructorCompany,
  description,
  rating,
  reviewCount,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
    <img src={imageUrl} alt={altText} className="w-full h-32 object-cover" />
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{instructorName}</h3>
          <p className="text-xs text-gray-600">{instructorRole}</p>
        </div>
      </div>
      <h4 className="text-md font-semibold mb-2" style={{ color: primaryColor }}>{instructorCompany}</h4>
      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{description}</p>
      <div className="flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center space-x-1">
          <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
          <span>{rating}</span>
          <span className="text-gray-400">({reviewCount})</span>
        </div>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-blue-500 focus:outline-none">
            <FaPen />
          </button>
          <button className="text-gray-500 hover:text-red-500 focus:outline-none">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const InstructorCoursesPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const currentYear = new Date().getFullYear();

  const allCourses: Course[] = [
    {
      id: 1,
      title: 'Introduction to React',
      imageUrl: '/images/react.png', // Replace with your actual image path
      altText: 'React Logo',
      instructorName: 'John Doe',
      instructorRole: 'Frontend Developer',
      instructorCompany: 'Acme Corp',
      yearPublished: 2023,
      description: 'Learn the fundamentals of React and build your first web application.',
      enrolledStudents: 150,
      rating: 4.8,
      publishDate: new Date('2023-08-15'),
      reviewCount: '25k reviews',
      status: 'published',
    },
    {
      id: 2,
      title: 'Node.js for Beginners',
      imageUrl: '/images/nodejs.png', // Replace with your actual image path
      altText: 'Node.js Logo',
      instructorName: 'Jane Smith',
      instructorRole: 'Backend Developer',
      instructorCompany: 'Beta Industries',
      yearPublished: 2024,
      description: 'Get started with server-side development using Node.js and Express.',
      enrolledStudents: 120,
      rating: 4.5,
      publishDate: new Date('2024-01-20'),
      reviewCount: '18k reviews',
      status: 'published',
    },
    {
      id: 3,
      title: 'Mastering JavaScript Algorithms',
      imageUrl: '/images/javascript.png', // Replace with your actual image path
      altText: 'JavaScript Logo',
      instructorName: 'Peter Jones',
      instructorRole: 'Software Engineer',
      instructorCompany: 'Gamma Solutions',
      yearPublished: 2022,
      description: 'Improve your problem-solving skills with in-depth JavaScript algorithms and data structures.',
      enrolledStudents: 90,
      rating: 4.2,
      publishDate: new Date('2022-11-05'),
      reviewCount: '12k reviews',
      status: 'published',
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      imageUrl: '/images/ui-ux.png', // Replace with your actual image path
      altText: 'UI/UX Design Tools',
      instructorName: 'Alice Brown',
      instructorRole: 'UI/UX Designer',
      instructorCompany: 'Delta Designs',
      yearPublished: 2024,
      description: 'Learn the core principles of user interface and user experience design.',
      enrolledStudents: 75,
      rating: 4.9,
      publishDate: new Date('2024-05-10'),
      reviewCount: '30k reviews',
      status: 'published',
    },
    {
      id: 5,
      title: 'Building RESTful APIs with Python & Flask',
      imageUrl: '/images/python.png', // Replace with your actual image path
      altText: 'Python Logo',
      instructorName: 'Charlie Wilson',
      instructorRole: 'Full-Stack Developer',
      instructorCompany: 'Epsilon Systems',
      yearPublished: 2025,
      description: 'Plan and build robust RESTful APIs using Python and the Flask framework.',
      enrolledStudents: 30,
      rating: 0,
      publishDate: new Date(),
      reviewCount: '0 reviews',
      status: 'planned',
    },
    {
      id: 6,
      title: 'Advanced CSS Techniques',
      imageUrl: '/images/css.png', // Replace with your actual image path
      altText: 'CSS Logo',
      instructorName: 'Sophia Garcia',
      instructorRole: 'Frontend Architect',
      instructorCompany: 'Zeta Technologies',
      yearPublished: 2025,
      description: 'Dive deep into advanced CSS concepts and techniques for modern web development.',
      enrolledStudents: 20,
      rating: 0,
      publishDate: new Date(),
      reviewCount: '0 reviews',
      status: 'unfinished',
    },
  ];

  const filteredCourses = useMemo(() => {
    switch (activeTab) {
      case 'published': return allCourses.filter(c => c.status === 'published');
      case 'top-rating': return allCourses.filter(c => c.status === 'published' && c.rating > 4.5).sort((a, b) => b.rating - a.rating);
      case 'unfinished': return allCourses.filter(c => c.status === 'unfinished');
      case 'padding-for-publish': return allCourses.filter(c => c.status === 'padding-for-publish');
      case 'planned': return allCourses.filter(c => c.status === 'planned');
      case 'past-year': return allCourses.filter(c => c.status === 'published' && c.yearPublished < currentYear);
      default: return allCourses;
    }
  }, [activeTab, allCourses, currentYear]);

  const tabs = [
    { value: 'all', label: 'All Courses' },
    { value: 'published', label: 'Published' },
    { value: 'top-rating', label: 'Top Rating' },
    { value: 'unfinished', label: 'Unfinished' },
    { value: 'padding-for-publish', label: 'Padding for Publish' },
    { value: 'planned', label: 'Planned' },
    { value: 'past-year', label: 'Past Year Published' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: primaryColor }}>Your Courses</h2>
          <button
            onClick={() => router.push('/dashboard/create-course')}
            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200"
          >
            <FaPlus className="inline-block mr-2" />
            Add New Course
          </button>
        </div>

        {/* Toggle for small screens */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowMobileTabs(!showMobileTabs)}
            className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm w-full"
          >
            {showMobileTabs ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Responsive filter layout */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <aside className={`mb-6 md:mb-0 w-full md:w-64 ${showMobileTabs ? 'block' : 'hidden sm:hidden md:block'}`}>
            <ul className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <li key={tab.value}>
                  <button
                    onClick={() => setActiveTab(tab.value)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      activeTab === tab.value
                        ? 'bg-[#8E1616] text-white hover:bg-[#B34747]'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} {...course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No courses found for the selected filter.
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button className="bg-white text-gray-600 rounded-full shadow-sm px-3 py-2 text-sm font-medium mr-2">
                Previous
              </button>
              <button className="bg-white text-gray-600 rounded-full shadow-sm px-3 py-2 text-sm font-medium ml-2">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default InstructorCoursesPage;