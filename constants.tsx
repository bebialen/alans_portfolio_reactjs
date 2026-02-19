
import React from 'react';
import { User, Briefcase, Zap, Mail, MessageSquare, Gamepad2, Award, Users, Star, Code2, Globe } from 'lucide-react';
import { AppType, Project, Skill } from './types';

export const APPS = [
  { id: AppType.ABOUT, name: 'About', icon: <User className="w-8 h-8 text-white" />, color: 'bg-blue-500' },
  { id: AppType.PROJECTS, name: 'Projects', icon: <Briefcase className="w-8 h-8 text-white" />, color: 'bg-green-500' },
  { id: AppType.SKILLS, name: 'Skills', icon: <Zap className="w-8 h-8 text-white" />, color: 'bg-orange-500' },
  { id: AppType.GEMINI, name: 'AI Ask', icon: <MessageSquare className="w-8 h-8 text-white" />, color: 'bg-purple-600' },
  { id: AppType.GAME, name: 'iRunner', icon: <Gamepad2 className="w-8 h-8 text-white" />, color: 'bg-yellow-500' },
  { id: AppType.CONTACT, name: 'Contact', icon: <Mail className="w-8 h-8 text-white" />, color: 'bg-red-500' },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Parkochi',
    description: 'A smart parking discovery and booking application built with Flutter using BLoC architecture. Enables users to find, reserve, and manage parking slots efficiently.',
    tech: ['Flutter', 'BLoC', 'Clean Architecture', 'REST API'],
    image: 'https://images.unsplash.com/photo-1551288049-bbda38a5f971?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: '2',
    title: 'Eduplay',
    description: 'A voice-based AI Quiz application designed for differently-abled users. Built using React and Gemini API. Selected in Top 10 out of 650 participants in a Carestack Hackathon.',
    tech: ['React', 'Gemini API', 'Vercel', 'AI Integration'],
    image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: '3',
    title: 'Valet Parking App',
    description: 'Vehicle entry and exit automation system for parking staff. Developed using Kotlin and Jetpack Compose with MVVM architecture and Node.js backend integration.',
    tech: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Node.js', 'MySQL', 'Figma'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: '4',
    title: 'IP Device Monitoring App',
    description: 'A mobile application to monitor and manage network IP devices remotely. Built with Flutter using Provider state management and Node.js backend.',
    tech: ['Flutter', 'Provider', 'Node.js', 'MySQL', 'Figma'],
    image: 'https://images.unsplash.com/photo-1551288049-bbda38a5f971?auto=format&fit=crop&q=80&w=800&h=400'
  }
];

export const EXPERIENCE_DATA = [
  {
    company: 'Elvicto Technologies',
    role: 'Software Developer',
    period: 'February 2024 – Present',
    description: 'Developing and maintaining production-level mobile applications using Flutter with Clean Architecture and Provider for state management. Contributing to Node.js and Angular projects and implementing AI/ML tasks such as object detection using YOLOv5.'
  },
  {
    company: 'ElsysLabs Technologies',
    role: 'AI/ML Intern',
    period: 'December 2023 – January 2024',
    description: 'Built a Resume Analyzer API using FastAPI leveraging Jaccard similarity for text matching. Containerized and deployed the application using Docker.'
  }
];

export const ACHIEVEMENTS_DATA = [
  { label: 'Experience', value: '1.7 Years', icon: <Star className="w-6 h-6 text-yellow-500" /> },
  { label: 'Projects Built', value: '6+', icon: <Users className="w-6 h-6 text-blue-500" /> },
  { label: 'Hackathon Finalist', value: 'Top 10/650', icon: <Award className="w-6 h-6 text-purple-500" /> },
  { label: 'Tech Stack', value: 'Flutter • React • Kotlin', icon: <Code2 className="w-6 h-6 text-green-500" /> }
];

export const SKILLS_DATA: Skill[] = [
  { name: 'Flutter', level: 90 },
  { name: 'Kotlin / Jetpack Compose', level: 85 },
  { name: 'React', level: 80 },
  { name: 'Node.js', level: 75 },
  { name: 'Provider / BLoC', level: 88 },
  { name: 'Clean Architecture', level: 85 }
];

