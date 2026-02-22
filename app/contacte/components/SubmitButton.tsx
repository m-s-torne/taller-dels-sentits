import type { FormStatus } from '@/app/contacte/types';

interface SubmitButtonProps {
  status: FormStatus;
  isFormValid: boolean;
}

export const SubmitButton = ({ status, isFormValid }: SubmitButtonProps) => {
  const isSending = status === 'sending';
  const isDisabled = isSending || !isFormValid;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-shakespeare hover:bg-shakespeare/90 active:scale-95'
      }`}
    >
      {isSending ? 'Enviant...' : 'Enviar Missatge'}
    </button>
  );
};
