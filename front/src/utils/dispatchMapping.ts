import { DispatchCarItem } from '../api/vehicleStatus';
import { DispatchDetail } from '../types/dispatch';

// 배차하기 - 차급별 차량
// API 응답 → UI에서 사용하는 DispatchDetail 변환
export const mapDispatchCarItemToDetail = (
  car: DispatchCarItem,
): DispatchDetail => {
  return {
    id: car.carId,
    model: car.model,
    year: String(car.year),
    number: car.carNum,
    location: car.locationName,
    washed: !car.needsWash,
    isConfirmed: car.likedOrConfirmed,
    isBookmarked: car.likedOrConfirmed,
    isInWashArea: car.locationName === 'ESA' || car.locationName === '렉시온',
    reserverName: car.reservationName,
  };
};
