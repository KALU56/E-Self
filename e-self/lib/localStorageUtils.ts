// Define the DisplayCourse interface so helpers know the data shape
export interface DisplayCourse {
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
  publishDate: Date | null;
  reviewCount: string;
  status: 'published' | 'planned' | 'unfinished' | 'padding-for-publish' | 'top-rating';
  category?: string;
}

// Add these interface definitions
export interface Lecture {
  title: string;
  videoLink: string;
  // upload?: File | null; // Based on your original state comment, this might not be stored but useful for UI state
}

export interface Section {
  title: string;
  description: string;
  lectures: Lecture[];
}


// Helper to get courses from local storage
export const getLocalCourses = (): DisplayCourse[] => {
  if (typeof window === 'undefined') return []; // Avoid localStorage on server side
  const savedCourses = localStorage.getItem('instructorCourses');
  if (!savedCourses) return [];

  try {
      return JSON.parse(savedCourses).map((course: Partial<DisplayCourse>) => ({
          ...course,
          // Ensure Date objects are correctly deserialized
          // Handle potential 'planned' status from older saves, mapping to 'padding-for-publish'
          status: course.status === 'planned' ? 'padding-for-publish' : (course.status || 'unfinished'),
          publishDate: course.publishDate ? new Date(course.publishDate) : null, // Only set date if it existed
          // Ensure other fields match DisplayCourse interface, providing defaults if missing
          id: course.id || Date.now() + Math.random(),
          imageUrl: course.imageUrl || 'https://source.unsplash.com/400x200/?education',
          altText: course.altText || 'Course Image',
          instructorName: course.instructorName || 'Instructor Name',
          instructorRole: course.instructorRole || 'Educator',
          instructorCompany: course.instructorCompany || 'Your Platform',
          yearPublished: course.yearPublished || new Date().getFullYear(),
          enrolledStudents: course.enrolledStudents || 0,
          rating: course.rating || 0,
          reviewCount: course.reviewCount || '0',
          category: course.category || 'Unknown',
      })) as DisplayCourse[]; // Assert the result is DisplayCourse array
  } catch (e) {
      console.error("Failed to parse courses from localStorage", e);
      return [];
  }
};

// Helper to save courses to local storage
export const saveLocalCourses = (courses: DisplayCourse[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('instructorCourses', JSON.stringify(courses));
};