// Application Constants
export const TOKEN_KEY = 'noteshare_token';
export const USER_KEY = 'noteshare_user';

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  NOTES: '/notes',
  NOTE_DETAILS: '/notes/:id',
  UPLOAD_NOTE: '/notes/upload',
  MY_UPLOADS: '/my-uploads',
  BOOKMARKS: '/bookmarks',
  PROFILE: '/profile',
};

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
};

export const SUBJECT_CATEGORIES = [
  { id: 'Computer Science', label: 'Computer Science & IT', iconName: 'Laptop', count: 'Algorithms, Data Structures, Web, AI' },
  { id: 'Mathematics', label: 'Mathematics & Statistics', iconName: 'Calculator', count: 'Calculus, Linear Algebra, Discrete Math' },
  { id: 'Electrical Engineering', label: 'Electrical & Electronics', iconName: 'Cpu', count: 'Circuits, Signals, Microprocessors' },
  { id: 'Mechanical Engineering', label: 'Mechanical Engineering', iconName: 'Wrench', count: 'Thermodynamics, Mechanics, CAD' },
  { id: 'Business & Economics', label: 'Business & Economics', iconName: 'TrendingUp', count: 'Finance, Microeconomics, Management' },
  { id: 'Natural Sciences', label: 'Physics & Chemistry', iconName: 'Atom', count: 'Mechanics, Quantum, Organic Chemistry' },
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];
