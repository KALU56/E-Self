import { Course } from '../types/course';

export const courses: Course[] = [
  {
    id: "web-development",
   
    title: "Complete Web Development",
    rating: 4.7,
    overallRating: "4.7/5",
    duration: 40,
    price: 99.99,
    image: "/images/full-stack.jpeg",
    description: "Learn full-stack web development...",
    detailedDescription: "This course covers HTML, CSS, JavaScript, React, and Node.js...",
    category: "Web Development",
    prerequisites: ["Basic computer skills"],
    requirements: ["PC with Windows 10", "Internet connection"],
    learningOutcomes: ["Build websites", "Understand backend development"],
    benefits: ["Lifetime access", "Certificate upon completion"],
    includes: ["Videos", "PDF resources"],
    expectations: "You will gain hands-on experience...",
    instructor: {
      name: "John Doe",
      rating: 4.8,
    },
    modules: [
      {
        title: "Introduction",
        lectures: [
          { title: "How To Succeed In This Course", duration: "05:04", preview: true },
          { title: "Join Our Online Classroom!", duration: "04:01" },
        ],
      },
      {
        title: "Big O",
        lectures: [
          { title: "What is Big O?", duration: "03:30" },
          { title: "Why It Matters", duration: "05:12" },
        ],
      },
    ],
  },
  {
    id: "uiux-design",
   
    title: "UI/UX Design Bootcamp",
    rating: 4.6,
    overallRating: "4.6/5",
    duration: 25,
    price: 79.99,
    image: "/images/uiux.jpeg",
    description: "Master the principles of user interface and experience design.",
    detailedDescription: "Learn Figma, wireframing, prototyping, and accessibility practices.",
    category: "Design",
    prerequisites: ["Creativity", "Willingness to learn"],
    requirements: ["Figma account", "Basic computer knowledge"],
    learningOutcomes: ["Design user-centered interfaces", "Create professional prototypes"],
    benefits: ["Real projects", "Design mentorship"],
    includes: ["Templates", "Design kits"],
    expectations: "You’ll learn to think like a designer...",
    instructor: {
      name: "Jane Smith",
      rating: 4.9,
    },
    modules: [
      {
        title: "Design Basics",
        lectures: [
          { title: "What is UI/UX?", duration: "04:00" },
          { title: "Design Thinking Process", duration: "06:10" },
        ],
      },
    ],
  },
  {
    id: "python-beginner",

    title: "Python for Beginners",
    rating: 4.5,
    overallRating: "4.5/5",
    duration: 20,
    price: 59.99,
    image: "/images/python.jpeg",
    description: "Start your Python journey from scratch.",
    detailedDescription: "Covers Python basics, functions, loops, and data structures.",
    category: "Programming",
    prerequisites: ["None"],
    requirements: ["Laptop", "Python installed"],
    learningOutcomes: ["Write Python scripts", "Understand programming logic"],
    benefits: ["Practice problems", "Quizzes"],
    includes: ["Code files", "Solutions"],
    expectations: "Start coding from day one...",
    instructor: {
      name: "Mark Lee",
      rating: 4.7,
    },
    modules: [
      {
        title: "Getting Started",
        lectures: [
          { title: "Installing Python", duration: "03:45" },
          { title: "Hello World", duration: "02:30" },
        ],
      },
    ],
  },
  {
    id: "data-science",
    
    title: "Data Science Masterclass",
    rating: 4.8,
    overallRating: "4.8/5",
    duration: 50,
    price: 129.99,
    image: "/images/datascience.jpeg",
    description: "Dive into machine learning, statistics, and real-world datasets.",
    detailedDescription: "Includes Pandas, NumPy, Scikit-learn, and deep learning basics.",
    category: "Data Science",
    prerequisites: ["Basic math", "Python knowledge"],
    requirements: ["Jupyter Notebook", "Python"],
    learningOutcomes: ["Analyze datasets", "Build ML models"],
    benefits: ["Career projects", "Interview preparation"],
    includes: ["Notebooks", "Project files"],
    expectations: "Hands-on real datasets...",
    instructor: {
      name: "Sara Kim",
      rating: 4.9,
    },
    modules: [
      {
        title: "Fundamentals",
        lectures: [
          { title: "What is Data Science?", duration: "04:20" },
          { title: "Tool Setup", duration: "05:10" },
        ],
      },
    ],
  },
  {
    id: "react-nextjs",
   
    title: "React & Next.js Zero to Hero",
    rating: 4.9,
    overallRating: "4.9/5",
    duration: 45,
    price: 119.99,
    image: "/images/react-next.jpeg",
    description: "Master modern frontend development with React and Next.js.",
    detailedDescription: "Covers components, hooks, routing, SSR, and deployment.",
    category: "Frontend Development",
    prerequisites: ["Basic HTML/CSS/JS"],
    requirements: ["Code editor", "Node.js installed"],
    learningOutcomes: ["Build React apps", "Deploy full-stack apps with Next.js"],
    benefits: ["Real apps", "Github-ready code"],
    includes: ["Source code", "Cheat sheets"],
    expectations: "Become confident building UIs...",
    instructor: {
      name: "Alex Johnson",
      rating: 4.8,
    },
    modules: [
      {
        title: "React Basics",
        lectures: [
          { title: "Creating Components", duration: "06:00" },
          { title: "Props & State", duration: "05:30" },
        ],
      },
    ],
  },
];
