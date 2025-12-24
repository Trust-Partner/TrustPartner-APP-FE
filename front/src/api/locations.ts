import axiosInstance from './axiosInstance';

export interface ParkingLocation {
  locationId: number;
  locationName: string;
}

export const fetchParkingLocations = async (): Promise<ParkingLocation[]> => {
  const res = await axiosInstance.get('/locations/v1/parking');
  return res.data.data;
};
