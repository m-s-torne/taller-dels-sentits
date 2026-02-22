import type { FormStatus } from '@/app/contacte/types/form.types';
import { getSubmitMessages } from '@/app/contacte/actions';

interface StatusMessagesProps {
  status: FormStatus;
}

export const StatusMessages = async ({ status }: StatusMessagesProps) => {
  if (status === 'idle') return null;

  const statusMessages = await getSubmitMessages();
  const message = statusMessages[status];

  return (
    <div className={`${message.bgColor} ${message.textColor} p-4 rounded-lg`}>
      {message.emoji} {message.text}
    </div>
  );
};
