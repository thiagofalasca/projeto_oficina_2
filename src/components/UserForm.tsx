'use client';

import {
  userSchema,
  adminSchema,
  superAdminSchema,
} from '@/lib/validations/user';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courses, Role } from '@/lib/constants';
import { Form } from './ui/form';
import CustomInput from '@/components/CustomInput';
import CustomSelect from '@/components/CustomSelect';
import FormMessage from '@/components/FormMessage';
import FormButton from '@/components/FormButton';
import {
  formatDate,
  getCourseOptions,
  getDepartmentOptions,
  getPeriodOptions,
  getStateOptions,
} from '@/lib/utils';
import {
  addAdmin,
  addStudent,
  addSuperAdmin,
  signUpAction,
} from '@/lib/actions/user/createUserActions';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import {
  updateAdmin,
  updateStudent,
  updateSuperAdmin,
} from '@/lib/actions/user/updateUserAction';

interface UserFormProps {
  role?: Role;
  isSignUp?: boolean;
  userToEdit?: User | StudentUser | ProfessorUser;
}

const UserForm = ({
  role = 'user',
  isSignUp = true,
  userToEdit,
}: UserFormProps) => {
  const schema =
    role === 'admin'
      ? adminSchema
      : role === 'superadmin'
        ? superAdminSchema
        : userSchema;

  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: userToEdit
      ? {
          name: userToEdit.name,
          cpf: userToEdit.cpf,
          phoneNumber: userToEdit.phoneNumber,
          birthDate: formatDate(userToEdit.birthDate),
          postalCode: userToEdit.postalCode,
          state: userToEdit.state,
          address: userToEdit.address,
          email: userToEdit.email,
          password: '',
          confirmPassword: '',
          ...(role === 'user'
            ? {
                ra: (userToEdit as StudentUser).ra,
                course: (userToEdit as StudentUser).courseId,
                period: '',
              }
            : {}),
        }
      : {
          name: '',
          cpf: '',
          phoneNumber: '',
          birthDate: '',
          postalCode: '',
          state: undefined,
          address: '',
          email: '',
          password: '',
          confirmPassword: '',
          ...(role === 'user'
            ? { ra: '', course: '', period: '' }
            : role === 'admin'
              ? { department: '' }
              : {}),
        },
  });

  const submitAction = (data: UserFormData) => {
    if (userToEdit) {
      return (
        role === 'admin'
          ? updateAdmin
          : role === 'superadmin'
            ? updateSuperAdmin
            : updateStudent
      )(userToEdit.id, data);
    } else {
      return (
        role === 'admin'
          ? addAdmin
          : role === 'superadmin'
            ? addSuperAdmin
            : isSignUp
              ? signUpAction
              : addStudent
      )(data);
    }
  };

  const { isPending, messageState, control, handleSubmit, onSubmit } =
    useFormSubmit(form, submitAction);

  const selectedCourseId = form.watch('course');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const stateOptions = getStateOptions();
  const courseOptions = getCourseOptions();
  const periodOptions = getPeriodOptions(selectedCourse || null);
  const departmentOptions = getDepartmentOptions();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          control={control}
          name="name"
          label="Nome Completo"
          placeholder="Digite o nome completo"
          maskName="name"
        />
        <CustomInput
          control={control}
          name="cpf"
          label="CPF"
          placeholder="Digite o cpf"
          maskName="cpf"
        />
        <div className="flex gap-4">
          <CustomInput
            control={control}
            name="phoneNumber"
            label="Numero de Telefone"
            maskName="phoneNumber"
            placeholder="Digite o numero de telefone"
          />
          <CustomInput
            control={control}
            name="birthDate"
            label="Data de Nascimento"
            placeholder="Digite sua data de nascimento"
            maskName="date"
          />
        </div>
        <div className="flex gap-4">
          <CustomInput
            control={control}
            name="postalCode"
            label="CEP"
            placeholder="Digite o CEP"
            maskName="postalCode"
          />
          <CustomSelect
            control={control}
            name="state"
            label="Estado"
            placeholder="Selecione o estado"
            options={stateOptions}
          />
        </div>
        <CustomInput
          control={control}
          name="address"
          label="Endereço"
          placeholder="Digite o endereço"
        />

        {role === 'user' && (
          <>
            <CustomInput
              control={control}
              name="ra"
              label="RA"
              placeholder="Digite o RA"
              maskName="ra"
            />
            <div className="flex gap-4">
              <div className="w-2/3">
                <CustomSelect
                  control={control}
                  name="course"
                  label="Curso"
                  placeholder="Selecione o curso"
                  options={courseOptions}
                />
              </div>
              <div className="w-1/3">
                <CustomSelect
                  control={control}
                  name="period"
                  label="Período"
                  placeholder="Selecione o período"
                  options={periodOptions}
                  disabled={!selectedCourse}
                />
              </div>
            </div>
          </>
        )}

        {role === 'admin' && (
          <CustomSelect
            control={control}
            name="department"
            label="Departamento"
            placeholder="Selecione o departamento"
            options={departmentOptions}
          />
        )}

        <CustomInput
          control={control}
          name="email"
          label="Email"
          placeholder="Digite o email"
          maskName="email"
        />
        <CustomInput
          control={control}
          name="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
        />
        <CustomInput
          control={control}
          name="confirmPassword"
          label="Confirme sua senha"
          placeholder="Digite sua senha novamente"
          type="password"
        />
        {messageState && (
          <FormMessage
            success={messageState.success}
            message={messageState.message}
          />
        )}
        <FormButton isLoading={isPending}>
          {userToEdit ? 'Atualizar Conta' : 'Criar Conta'}
        </FormButton>
      </form>
    </Form>
  );
};

export default UserForm;
