export interface ReplacementContractDraft {
  contractId: number;

  customerName?: string;
  phone?: string;
  address?: string;

  customerCarModel?: string;
  customerCarNumber?: string;
  customerDisplacement?: string;

  insuranceCompany?: string;
  reportNumber?: string;

  requestCompany?: string;
  garageCompany?: string;

  fuel?: number;

  photos: string[];
  signature?: string;
}
