import { MessageType } from '@/contexts/message';
import { useEffect } from 'react';

interface ToastProps {
  message: string | undefined;
  type: MessageType | undefined;
  clearMessage: () => void;
}

const toastColors: Record<MessageType, string> = {
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  success: 'bg-green-500',
};

const Toast = ({ message, type, clearMessage }: ToastProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clearMessage, message]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-12 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg
                 ${toastColors[type || 'info']} 
                 backdrop-blur-md bg-opacity-60 text-white font-semibold`}
    >
      {message}
    </div>
  );
};

export default Toast;
