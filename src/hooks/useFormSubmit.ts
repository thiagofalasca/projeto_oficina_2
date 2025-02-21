import { useState, useTransition } from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

export const useFormSubmit = <TFormValues extends FieldValues>(
  form: UseFormReturn<TFormValues>,
  action: (data: TFormValues) => Promise<ResultState<TFormValues>>
) => {
  const [messageState, setMessageState] = useState<MessageState>({});
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, setError } = form;

  const onSubmit = async (data: TFormValues) => {
    startTransition(async () => {
      const result = await action(data);
      setMessageState(result);

      if (result.validationErrors) {
        Object.entries(result.validationErrors).forEach(([field, messages]) => {
          setError(field as Path<TFormValues>, {
            message: messages?.[0],
          });
        });
      }
    });
  };

  return {
    isPending,
    messageState,
    control,
    handleSubmit,
    onSubmit,
  };
};
