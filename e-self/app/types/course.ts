import { CourseModule } from './module';

export type Course = {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  duration: number;
  price: number;
  image: string;
  rating: number;
  overallRating: string;
  category: string;
  prerequisites: string[];
  requirements: string[];
  learningOutcomes: string[];
  benefits: string[];
  includes: string[];
  expectations: string;
  instructor: {
    name: string;
    rating: number;
  };
  modules: CourseModule[]; // added this
};
