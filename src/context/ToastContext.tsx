import { ToastData } from '@/types';
import { createContext } from 'react';

interface ToastContextData {
  addToast: (newToast: ToastData) => void;
}

export const ToastContext = createContext({} as ToastContextData);
