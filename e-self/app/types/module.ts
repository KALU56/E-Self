export type Lecture = {
  title: string;
  duration: string;
  preview?: boolean;
};

export type CourseModule = {
  title: string;
  description?: string;
  lectures: Lecture[];
};
