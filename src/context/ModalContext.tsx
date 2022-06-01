import { ModalType } from '@/types';
import { createContext } from 'react';

interface ModalContextData {
  modalType: ModalType | null;
  modalProps?: { hasNoCredits: boolean } | null;
  openModal: (modalType: ModalType, modalProps?: { hasNoCredits: boolean }) => void;
  closeModal: () => void;
}

export const ModalContext = createContext({} as ModalContextData);
