import { useMutation } from '@tanstack/react-query';
import {
  sendFindPasswordCode,
  FindPasswordCodePayload,
} from '../../api/auth';

export const useFindPasswordCode = () => {
  return useMutation<
    void,
    Error,
    { role: 'admin' | 'user'; payload: FindPasswordCodePayload }
  >({
    mutationFn: ({ role, payload }) => sendFindPasswordCode(role, payload),
  });
};

