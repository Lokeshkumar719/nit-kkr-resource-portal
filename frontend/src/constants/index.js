// src/constants/index.js
// Single source of truth for frontend dropdown/filter values.
// These MUST mirror the backend's actual constants + model enums —
// do not add values here that the backend doesn't recognize.

// Mirrors backend/src/constants/branches.js exactly
export const BRANCHES = ['CSE', 'IT', 'AIDS', 'AIML', 'MNC', 'ECE', 'EE', 'ME', 'PIE', 'CE'];

export const BRANCH_LABELS = {
  'CSE': 'Computer Engineering (CSE)',
  'IT': 'Information Technology (IT)',
  'AIDS': 'Artificial Intelligence & Data Science (AIDS)',
  'AIML': 'AI & Machine Learning (AIML)',
  'MNC': 'Mathematics & Computing (MNC)',
  'ECE': 'Electronics & Communication (ECE)',
  'EE': 'Electrical Engineering (EE)',
  'ME': 'Mechanical Engineering (ME)',
  'PIE': 'Production & Industrial (PIE)',
  'CE': 'Civil Engineering (CE)'
};

// Mirrors backend/src/constants/semesters.js exactly
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Mirrors backend/src/constants/resourceTypes.js exactly
export const RESOURCE_TYPES = [
  { value: 'LECTURES', label: 'Lecture' },
  { value: 'BOOKS', label: 'Book / PDF' },
  { value: 'PYQS', label: 'PYQ' },
  { value: 'NOTES', label: 'Notes' },
];

// Mirrors backend/src/models/Mentor.js -> year enum exactly.
export const SENIOR_YEARS = ['2nd Year', '3rd Year', '4th Year'];
export const ALUMNI_YEAR_VALUE = 'Alumni';
export const ALL_MENTOR_YEARS = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];

// Mirrors backend/src/constants/roles.js exactly
export const USER_ROLES = { USER: 'USER', ADMIN: 'ADMIN' };

export const MENTOR_TAGS = [
  "Competitive Programming",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile App Development",
  "Machine Learning & AI",
  "Data Science & Analytics",
  "Cyber Security",
  "Cloud & DevOps",
  "Blockchain / Web3",
  "Open Source",
  "UI/UX Design",
  "System Design",
  "Core CS (OS, DBMS, CN)",
  "Research & Higher Studies",
  "IoT & Embedded Systems",
  "Game Development",
  "AR/VR",
  "Product Management",
  "Quant / Algorithmic Trading",
  "Placement & Interview Prep"
];