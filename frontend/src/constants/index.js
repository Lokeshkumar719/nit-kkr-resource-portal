// src/constants/index.js
// Single source of truth for frontend dropdown/filter values.
// These MUST mirror the backend's actual constants + model enums —
// do not add values here that the backend doesn't recognize.

// Mirrors backend/src/constants/branches.js exactly
export const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'PIE', 'CE'];

// Mirrors backend/src/constants/semesters.js exactly
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Mirrors backend/src/models/Resource.js -> resources[].type enum exactly
// (NOT backend/src/constants/resourceTypes.js — that file's values
// ('BOOKS','NOTES','PYQS','LECTURES') don't match what the Resource
// model actually validates/stores. The model is the real contract.)
export const RESOURCE_TYPES = [
  { value: 'lecture', label: 'Lecture' },
  { value: 'pdf', label: 'Book / PDF' },
  { value: 'pyq', label: 'PYQ' },
  { value: 'notes', label: 'Notes' },
];

// Mirrors backend/src/models/Mentor.js -> year enum exactly.
// Senior Support should only ever show the first three;
// 'Alumni' is reserved for the Alumni Network section.
export const SENIOR_YEARS = ['2nd Year', '3rd Year', '4th Year'];
export const ALUMNI_YEAR_VALUE = 'Alumni';
export const ALL_MENTOR_YEARS = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];

// Mirrors backend/src/constants/roles.js exactly
export const USER_ROLES = { USER: 'USER', ADMIN: 'ADMIN' };

// Professional skill tags for Alumni/Senior profile cards.
// Frontend-only categorization, no backend enum for this yet —
// used purely for optional display/filtering, never sent to the API
// unless the profile data itself contains a `skills` array.
export const SKILL_TAG_SUGGESTIONS = [
  'Competitive Programming',
  'Machine Learning',
  'Deep Learning',
  'Data Science',
  'Backend Development',
  'Frontend Development',
  'System Design',
  'Research',
  'Cloud Computing',
  'DevOps',
  'Open Source',
];