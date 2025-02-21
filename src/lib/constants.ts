import {
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

// prettier-ignore
export const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type State = (typeof states)[number];

export const courses = [
  {
    id: 'ES',
    name: 'Engenharia de Software',
    totalPeriods: 8,
  },
  {
    id: 'EC',
    name: 'Engenharia de Computação',
    totalPeriods: 10,
  },
  {
    id: 'EE',
    name: 'Engenharia Elétrica',
    totalPeriods: 10,
  },
  {
    id: 'EM',
    name: 'Engenharia Mecânica',
    totalPeriods: 10,
  },
  {
    id: 'ADS',
    name: 'Análise e Desenvolvimento de Sistemas',
    totalPeriods: 6,
  },
] as const;

export const ROLES = ['user', 'admin', 'superadmin'] as const;
export type Role = (typeof ROLES)[number];

export const iconMap = {
  wrench: WrenchScrewdriverIcon,
  document: DocumentCheckIcon,
  search: MagnifyingGlassIcon,
  users: UsersIcon,
} as const;

export type IconType = keyof typeof iconMap;

export interface NavLink {
  label: string;
  route: string;
  icon: IconType;
}

export const userLinks: NavLink[] = [
  {
    label: 'Workshops',
    route: '/workshops',
    icon: 'wrench',
  },
  {
    label: 'Buscar Workshops',
    route: '/find-workshops',
    icon: 'search',
  },
  {
    label: 'Certificados',
    route: '/certificates',
    icon: 'document',
  },
];

export const adminLinks: NavLink[] = [
  {
    label: 'Workshops',
    route: '/workshops',
    icon: 'wrench',
  },
  {
    label: 'Usuários',
    route: '/users',
    icon: 'users',
  },
];

export const workshopStatus = [
  'Ativo',
  'Rascunho',
  'Completo',
  'Inativo',
] as const;

export type WorkshopStatus = (typeof workshopStatus)[number];

export const workshopStatusStyles = {
  Ativo: 'bg-green-100 text-green-800 border-green-300',
  Rascunho: 'bg-gray-100 text-gray-800 border-gray-300',
  Completo: 'bg-blue-100 text-blue-800 border-blue-300',
  Inativo: 'bg-red-100 text-red-800 border-red-300',
} as const;

export const WORKSHOPS_PER_PAGE = 6;
export const ENROLLMENTS_PER_PAGE = 10;

export const departmentsName = [
  'DACOM',
  'DAELE',
  'DAMAT',
  'DAMEC',
  'DACIN',
  'DACHS',
] as const;

export type ToastType = 'success' | 'error' | 'info' | 'warning';
