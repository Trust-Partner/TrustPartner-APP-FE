import { useMutation } from '@tanstack/react-query';
import { findId, FindIdPayload, FindIdResponse } from '../../api/auth';

export const useFindId = () => {
  return useMutation<
    FindIdResponse,
    Error,
    { role: 'admin' | 'user'; payload: FindIdPayload }
  >({
    mutationFn: ({ role, payload }) => findId(role, payload),
  });
};

