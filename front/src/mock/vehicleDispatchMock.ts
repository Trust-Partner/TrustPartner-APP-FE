export type DispatchGroup = {
  id: number;
  name: string;
  total: number;
  ready: number;
  active: number;
};

// 세단
export const sedanDispatchList: DispatchGroup[] = [
  { id: 1, name: '모닝급', total: 7, ready: 0, active: 2 },
  { id: 2, name: 'G80', total: 5, ready: 0, active: 2 },
  { id: 3, name: '아반떼급', total: 14, ready: 0, active: 5 },
  { id: 4, name: '쏘나타급', total: 9, ready: 0, active: 4 },
  { id: 5, name: '그랜저급', total: 8, ready: 0, active: 3 },
];

// SUV
export const suvDispatchList: DispatchGroup[] = [
  { id: 1, name: '셀토스급', total: 14, ready: 1, active: 5 },
  { id: 2, name: 'GV80', total: 6, ready: 0, active: 1 },
  { id: 3, name: '스포티지급', total: 12, ready: 0, active: 6 },
  { id: 4, name: '카니발급', total: 5, ready: 0, active: 1 },
  { id: 5, name: '싼타페급', total: 14, ready: 0, active: 6 },
  { id: 6, name: '스타리아급', total: 4, ready: 0, active: 0 },
  { id: 7, name: '펠리세이드급', total: 13, ready: 0, active: 0 },
];

// 수입차
export const importDispatchList: DispatchGroup[] = [
  { id: 1, name: '3S / C클', total: 0, ready: 0, active: 0 },
  { id: 2, name: 'X3 / GLC', total: 0, ready: 0, active: 0 },
  { id: 3, name: '5S / E클', total: 0, ready: 0, active: 0 },
  { id: 4, name: 'X5 / GLE', total: 0, ready: 0, active: 0 },
  { id: 5, name: '7S / S클', total: 0, ready: 0, active: 0 },
  { id: 6, name: 'X7 / GLS', total: 0, ready: 0, active: 0 },
];
