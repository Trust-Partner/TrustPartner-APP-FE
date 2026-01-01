import { DispatchDetail } from '../types/dispatch';
import { DispatchCarApiItem } from '../api/vehicleStatus';

export const mapDispatchCarItemToDetail = (
  item: DispatchCarApiItem,
): DispatchDetail => ({
  id: item.carId,
  model: item.model,
  year: item.year,
  number: item.carNum,
  location: item.locationName,

  washed: !item.needsWash,
  isInWashArea: item.needsWash,

  isBookmarked: item.isLiked,
  isConfirmed: item.isConfirmed,

  reserverName: item.reservationName,

  carDispatchId: item.carDispatchId,
  draftingContract: item.draftingContract,
  contractType: item.contractType,
  contractId: item.contractId,
});
