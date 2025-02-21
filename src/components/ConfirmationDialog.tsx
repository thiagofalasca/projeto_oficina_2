'use client';

import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/CustomDialog';
import { useDialog } from '@/hooks/useDialog';

type ConfirmationDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  confirmText?: string;
  loadingText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
};

const ConfirmationDialog = ({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = 'Confirmar',
  loadingText = 'Carregando...',
  cancelText = 'Cancelar',
  variant = 'destructive',
}: ConfirmationDialogProps) => {
  const { isPending, startTransition, open, handleOpenChange } = useDialog();

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirm();
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
      <form action={handleConfirm} className="space-y-4">
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {cancelText}
            </Button>
          </DialogClose>
          <Button type="submit" variant={variant} disabled={isPending}>
            {isPending ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </form>
    </CustomDialog>
  );
};

export default ConfirmationDialog;
