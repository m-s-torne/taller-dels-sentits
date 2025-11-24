"use server"
import type { FormStatus } from '@/app/contacte/types';

interface StatusMessage {
  type: FormStatus;
  text: string;
  emoji: string;
  bgColor: string;
  textColor: string;
}

export const getSubmitMessages = async (): Promise<Record<Exclude<FormStatus, 'idle'>, StatusMessage>> => {
  return {
    sending: {
      type: 'sending',
      emoji: '📤',
      text: 'Enviant el teu missatge...',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    success: {
      type: 'success',
      emoji: '✅',
      text: 'Missatge enviat amb èxit! Ens posarem en contacte aviat.',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    error: {
      type: 'error',
      emoji: '❌',
      text: 'Hi ha hagut un error. Si us plau, torna-ho a intentar.',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  };
};
