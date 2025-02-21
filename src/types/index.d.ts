declare interface MessageState {
  success?: boolean;
  message?: string;
}

declare interface ResultState<T> extends MessageState {
  validationErrors?: Partial<Record<keyof T, string[]>>;
}

interface WorkshopSearchParams {
  query?: string;
  page?: string;
  created?: string;
  updated?: string;
  deleted?: string;
}

declare type Token = {
  email: string;
  identifier: string;
  token: string;
  expires: Date;
};

declare type Course = {
  id: string;
  name: string;
  totalPeriods: number;
};

declare type loggedUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
};

declare type User = {
  id: string;
  name: string;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword: string;
  cpf: string;
  phoneNumber: string;
  birthDate: string;
  postalCode: string;
  state: string;
  address: string;
  role: Role;
};

declare type Workshop = {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: WorkshopStatus;
  key: string | null;
  professor: {
    id: string;
    name: string;
    email: string;
  };
  enrollmentsCount: number;
};

declare type Enrollment = {
  id: string;
  name: string;
  email: string;
  ra: string;
};

declare type Student = {
  id: string;
  name: string;
  ra: string;
};

declare type Professor = {
  id: string;
  departmentId: string;
};

declare type ProfessorOption = {
  value: string;
  label: string;
};
