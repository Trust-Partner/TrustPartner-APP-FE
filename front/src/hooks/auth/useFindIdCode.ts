import { useMutation } from '@tanstack/react-query';
import {
  sendFindIdCode,
  FindIdCodePayload,
} from '../../api/auth';

export const useFindIdCode = () => {
  return useMutation<
    void,
    Error,
    { role: 'admin' | 'user'; payload: FindIdCodePayload }
  >({
    mutationFn: ({ role, payload }) => sendFindIdCode(role, payload),
  });
};

