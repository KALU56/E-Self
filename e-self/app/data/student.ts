// app/data/student.ts
export const studentData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    enrolledCourses: ["Web Development", "Data Science"],
    category: "Web Development",
    status: "Active",
    progress: 75,
    enrolledDate: "2023-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    enrolledCourses: ["Design Basics"],
    category: "Design",
    status: "Inactive",
    progress: 30,
    enrolledDate: "2023-02-01",
  },
  {
    id: 3,
    name: "Peter Jones",
    email: "peter@example.com",
    enrolledCourses: ["Web Development", "React Advanced"],
    category: "Web Development",
    status: "Active",
    progress: 90,
    enrolledDate: "2023-03-15",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    enrolledCourses: ["Data Science", "Python Fundamentals"],
    category: "Data Science",
    status: "Active",
    progress: 60,
    enrolledDate: "2023-04-20",
  },
  {
    id: 5,
    name: "Bob Green",
    email: "bob@example.com",
    enrolledCourses: ["Design Basics", "UI/UX Principles"],
    category: "Design",
    status: "Active",
    progress: 45,
    enrolledDate: "2023-05-10",
  },
  {
    id: 6,
    name: "Sara Miller",
    email: "sara@example.com",
    enrolledCourses: ["Web Development", "Node.js Mastery"],
    category: "Web Development",
    status: "Active",
    progress: 80,
    enrolledDate: "2023-06-01",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david@example.com",
    enrolledCourses: ["Data Science", "Machine Learning"],
    category: "Data Science",
    status: "Inactive",
    progress: 20,
    enrolledDate: "2023-07-12",
  },
  {
    id: 8,
    name: "Emily Clark",
    email: "emily@example.com",
    enrolledCourses: ["Design Basics", "Graphic Design"],
    category: "Design",
    status: "Active",
    progress: 70,
    enrolledDate: "2023-08-05",
  },
  {
    id: 9,
    name: "Kevin Lewis",
    email: "kevin@example.com",
    enrolledCourses: ["Web Development", "Angular Framework"],
    category: "Web Development",
    status: "Active",
    progress: 55,
    enrolledDate: "2023-09-18",
  },
  {
    id: 10,
    name: "Laura Hall",
    email: "laura@example.com",
    enrolledCourses: ["Data Science", "Data Visualization"],
    category: "Data Science",
    status: "Active",
    progress: 85,
    enrolledDate: "2023-10-25",
  },
];
export type Student = {
  name: string;
  email: string;
  enrolledCourses: string[];
  category: string;
  status: string;
  progress: number;
  enrolledDate: string;
};