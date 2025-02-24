import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  courses,
  departmentsName,
  states,
  workshopStatus,
} from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export function formatDateToISO(date: string): string {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

export function parseDate(date: string): Date {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function isValidDate(dateString: string): boolean {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const getStateOptions = () => {
  return states.map((state) => ({
    value: state,
    label: state,
  }));
};

export const getCourseOptions = () => {
  return courses.map((course) => ({
    value: course.id,
    label: course.name,
  }));
};

export const getStatusOptions = () => {
  return workshopStatus.map((status) => ({
    value: status,
    label: status,
  }));
};

export const getDepartmentOptions = () => {
  return departmentsName.map((department) => ({
    value: department,
    label: department,
  }));
};

export const getPeriodOptions = (selectedCourse: Course | null) => {
  if (!selectedCourse) return [];

  return Array.from({ length: selectedCourse.totalPeriods }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}º Período`,
  }));
};

export const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
  return diffDays === 1 ? '1 dia' : `${diffDays} dias`;
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
