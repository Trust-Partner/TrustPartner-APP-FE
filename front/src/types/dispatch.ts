export interface DispatchDetail {
  id: number;
  model: string;
  year: string;
  number: string;
  location: string;
  washed: boolean;
  isConfirmed: boolean;
  isBookmarked: boolean;
  isInWashArea: boolean;
  reserverName: string | null;
}
