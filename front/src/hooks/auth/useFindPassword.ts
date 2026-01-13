import { useMutation } from '@tanstack/react-query';
import {
  findPassword,
  FindPasswordPayload,
  FindPasswordResponse,
} from '../../api/auth';

export const useFindPassword = () => {
  return useMutation<
    FindPasswordResponse,
    Error,
    { role: 'admin' | 'user'; payload: FindPasswordPayload }
  >({
    mutationFn: ({ role, payload }) => findPassword(role, payload),
  });
};

