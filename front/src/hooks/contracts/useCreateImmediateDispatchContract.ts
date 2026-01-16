import { useMutation } from '@tanstack/react-query';
import { createImmediateDispatchContract } from '../../api/contracts/userImmediateDispatch';

export const useCreateImmediateDispatchContract = () =>
  useMutation({
    mutationFn: (carId: number) => createImmediateDispatchContract(carId),
  });
