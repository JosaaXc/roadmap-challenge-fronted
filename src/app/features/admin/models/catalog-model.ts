export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  tags: string[];
  url: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDto extends Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
  isActive: boolean;
}

