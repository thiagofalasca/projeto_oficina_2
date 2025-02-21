'use client';

import { toast } from 'sonner';
import { useEffect } from 'react';
import { ToastType } from '@/lib/constants';

interface ToastMessageProps {
  type?: ToastType;
  message?: string;
  show?: boolean;
}

const ToastMessage = ({
  type = 'success',
  message,
  show,
}: ToastMessageProps) => {
  useEffect(() => {
    if (!show || !message) return;

    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
        toast.info(message);
        break;
    }
  }, [message, type, show]);

  return null;
};

export default ToastMessage;
