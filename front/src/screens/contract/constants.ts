import { ContractType, ContractSectionKey } from './types';

export const CONTRACT_SECTIONS_BY_TYPE: Record<
  ContractType,
  ContractSectionKey[]
> = {
  INSURANCE: ['MEMO', 'DATE', 'CUSTOMER', 'ACCIDENT', 'INSURANCE_CLAIM'],
  GENERAL: ['MEMO', 'DATE', 'CUSTOMER', 'PAYMENT'],
};
