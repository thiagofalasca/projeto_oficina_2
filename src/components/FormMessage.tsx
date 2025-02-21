import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

const types = {
  success: {
    style: 'bg-emerald-500/15 text-emerald-500',
    icon: <CheckCircleIcon className="mt-[1px] h-4" />,
  },
  error: {
    style: 'bg-destructive/15 text-destructive',
    icon: <ExclamationTriangleIcon className="mt-[1px] h-4" />,
  },
};

const FormMessage = ({ success = false, message }: MessageState) => {
  if (!message) return null;

  const type = success ? 'success' : 'error';
  const { style, icon } = types[type];

  return (
    <div className={`form-message ${style}`}>
      {icon}
      <p>{message}</p>
    </div>
  );
};

export default FormMessage;
