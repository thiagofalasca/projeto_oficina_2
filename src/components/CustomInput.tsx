import React, { ChangeEvent } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Control,
  FieldPath,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import {
  phoneNumberMask,
  nameMask,
  cpfMask,
  dateMask,
  postalCodeMask,
  raMask,
  emailMask,
} from '@/lib/masks';
import { Textarea } from '@/components/ui/textarea';

interface CustomInputProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  type?: string;
  maskName?: string;
  description?: React.ReactNode;
}

const CustomInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  maskName,
  description,
}: CustomInputProps<TFieldValues>) => {
  const { setValue } = useFormContext();

  const applyMask = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue = value;

    switch (maskName) {
      case 'phoneNumber':
        newValue = phoneNumberMask(value);
        break;
      case 'name':
        newValue = nameMask(value);
        break;
      case 'cpf':
        newValue = cpfMask(value);
        break;
      case 'date':
        newValue = dateMask(value);
        break;
      case 'postalCode':
        newValue = postalCodeMask(value);
        break;
      case 'ra':
        newValue = raMask(value);
        break;
      case 'email':
        newValue = emailMask(value);
        break;
      default:
        break;
    }

    setValue(name, newValue);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel htmlFor={name} className="font-medium text-gray-700">
            {label}
          </FormLabel>
          <FormControl onChange={applyMask}>
            {type === 'textarea' ? (
              <Textarea
                id={name}
                placeholder={placeholder}
                className="rounded-lg border border-gray-300"
                {...field}
              />
            ) : (
              <Input
                id={name}
                type={type}
                data-mask={maskName}
                placeholder={placeholder}
                className="rounded-lg border border-gray-300"
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
          {description && description}
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
