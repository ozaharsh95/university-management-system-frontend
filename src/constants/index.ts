import { GraduationCap, School } from "lucide-react";
import { UserRole } from "@/types";

export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
};

export const ROLE_OPTIONS = [
  {
    value: USER_ROLES.STUDENT,
    label: "Student",
    icon: GraduationCap,
  },
  {
    value: USER_ROLES.TEACHER,
    label: "Teacher",
    icon: School,
  },
];

export const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Economics",
  "Business Administration",
  "Engineering",
  "Psychology",
  "Sociology",
  "Political Science",
  "Philosophy",
  "Education",
  "Fine Arts",
  "Music",
  "Physical Education",
  "Law",
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
  value: dept,
  label: dept,
}));

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

function getEnvVariable(key: string) {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET;

export const RESOURCE_ROLES: Record<string, UserRole[]> = {
  dashboard: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
  profile: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
  announcements: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
  classes: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
  users: [UserRole.ADMIN, UserRole.TEACHER],
  schedule: [UserRole.TEACHER, UserRole.STUDENT],
  "join-class": [UserRole.STUDENT],
  subjects: [UserRole.ADMIN],
  departments: [UserRole.ADMIN],
  enrollments: [UserRole.ADMIN],
  reports: [UserRole.ADMIN],
};
