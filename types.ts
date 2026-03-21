
export enum AppType {
  LOCKED = 'LOCKED',
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PROJECTS = 'PROJECTS',
  SKILLS = 'SKILLS',
  CONTACT = 'CONTACT',
  GEMINI = 'GEMINI',
  GAME = 'GAME'
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  category: string;
  readTime: string;
}

export interface Skill {
  name: string;
  level: number;
}
