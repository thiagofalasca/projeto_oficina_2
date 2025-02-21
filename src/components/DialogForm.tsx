'use client';

import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import CustomDialog from '@/components/CustomDialog';
import FormMessage from '@/components/FormMessage';
import { Form } from '@/components/ui/form';
import { useDialog } from '@/hooks/useDialog';

interface DialogFormProps<TFormValues extends FieldValues> {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  form: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => Promise<void>;
  submitText: string;
  loadingText: string;
  children?: React.ReactNode;
  messageState?: MessageState;
}

const DialogForm = <TFormValues extends FieldValues>({
  trigger,
  title,
  description,
  form,
  onSubmit,
  submitText,
  loadingText,
  children,
  messageState,
}: DialogFormProps<TFormValues>) => {
  const { isPending, startTransition, open, handleOpenChange } =
    useDialog(form);

  const handleSubmit = async (data: TFormValues) => {
    startTransition(async () => {
      await onSubmit(data);
    });
  };

  return (
    <CustomDialog
      trigger={trigger}
      title={title}
      description={description}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {children}
          {messageState && (
            <FormMessage
              success={messageState.success}
              message={messageState.message}
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="base-btn green-btn"
              disabled={isPending}
            >
              {isPending ? loadingText : submitText}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default DialogForm;
