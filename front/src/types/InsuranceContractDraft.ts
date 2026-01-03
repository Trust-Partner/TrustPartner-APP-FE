export interface InsuranceContractDraft {
  contractId: number;
  fuelQuantity?: number;

  customer: {
    name?: string;
    phone?: string;
    address?: string;
    carType?: string;
    carNumber?: string;
    carDisplacement?: string;
  };

  insurance: {
    companyName?: string;
    applicationNumber?: string;
  };

  partner: {
    id?: string;
    name?: string;
  };

  repairShop: {
    id?: string;
    name?: string;
  };

  photos: string[];
  signature?: string;
}
