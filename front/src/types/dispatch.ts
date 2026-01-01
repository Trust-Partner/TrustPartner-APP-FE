import { ContractType } from '../api/vehicleStatus';

export interface DispatchDetail {
  /** 차량 기본 정보 */
  id: number;
  model: string;
  year: number;
  number: string;
  location: string;

  /** 상태 정보 */
  washed: boolean;
  isInWashArea: boolean;

  /** 즐겨찾기 / 확정 상태 */
  isConfirmed: boolean;
  isBookmarked: boolean;

  /** 예약 정보 */
  reserverName: string | null;

  /** 배차 / 계약 연동 */
  carDispatchId: number | null;
  draftingContract: boolean;
  contractType: ContractType | null;
  contractId: number | null;
}
