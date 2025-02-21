import { useCallback, useState, useTransition } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export const useDialog = <TFormValues extends FieldValues = FieldValues>(
  form?: UseFormReturn<TFormValues>
) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open && form) {
        form.reset();
      }
    },
    [form]
  );

  return {
    isPending,
    startTransition,
    open,
    handleOpenChange,
  };
};
