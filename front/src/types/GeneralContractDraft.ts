export interface GeneralContractDraft {
  contractId: number;
  fuelQuantity?: number;
  memo?: string;

  customer: {
    name?: string;
    phone?: string;
    address?: string;
  };

  payment?: {
    method?: 'ACCOUNT_TRANSFER' | 'CARD';
    time?: 'PREPAID' | 'POSTPAID';
    amount?: number;
  };

  photos?: string[];
  signature?: string;
}
