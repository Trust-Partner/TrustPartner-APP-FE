import { ContractType } from '../api/vehicleStatus';

export interface ContractVehicleBase {
  /** 차량 기본 정보 */
  id: number;
  model: string;
  number: string;
  location?: string;
  year?: number;
  washed?: boolean;

  /** 상태 */
  isConfirmed?: boolean;
  isBookmarked?: boolean;
  reserverName: string | null;

  /** 배차 / 계약 연동 (중요) */
  carDispatchId: number | null;
  draftingContract: boolean;
  contractType: ContractType | null;
  contractId: number | null;

  /** UI용 상태 (선택) */
  status?: '배차중' | '대기중' | '반납신청';
}
