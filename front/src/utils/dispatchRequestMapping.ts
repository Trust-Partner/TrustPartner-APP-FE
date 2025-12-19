import { DispatchItem } from '../api/dispatch';
import { getCarYearGroupLabel, getDisplacementLabel } from './carMapping';

export interface DispatchRequestVM {
  id: number;
  isReplacement: boolean;

  company: string;
  model: string;
  year?: string;
  displacement?: string;
}

export const mapDispatchItemToVM = (item: DispatchItem): DispatchRequestVM => ({
  id: item.dispatchId,
  isReplacement: item.isReplacement,
  company: item.partnerName,
  model: item.carModel,

  year: getCarYearGroupLabel(item.carYearGroup),
  displacement: getDisplacementLabel(item.displacementGroup),
});
