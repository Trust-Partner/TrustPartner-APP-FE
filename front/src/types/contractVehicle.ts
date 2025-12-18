export interface ContractVehicleBase {
  id: number;
  model: string;
  number: string;
  location?: string;
  year?: string;
  washed?: boolean;
  isConfirmed?: boolean;
  isBookmarked?: boolean;
  reserverName: string | null;
  isGarage?: boolean;
  status?: '배차중' | '대기중' | '반납신청';
}
